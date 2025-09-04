import React from 'react';

const getScrollbarSize = (): { scrollbarWidth: number; scrollbarHeight: number } => {
  const node = document.createElement('div');
  node.setAttribute(
    'style',
    'width: 100px; height: 100px; position: absolute; top: -1000000px; overflow: scroll;',
  );
  document.body.append(node);

  const scrollbarWidth = node.offsetWidth - node.clientWidth;
  const scrollbarHeight = node.offsetHeight - node.clientHeight;

  node.remove();

  return { scrollbarWidth, scrollbarHeight };
};

export type SizeScrollbarRenderProps = {
  width: number;
  height: number;
  scrollbarWidth: number;
  scrollbarHeight: number;
};
export type SizeScrollbarProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
> & {
  readonly width?: string | number;
  readonly height?: string | number;
  children(this: void, state: SizeScrollbarRenderProps): React.ReactNode;
};

export const SizeScrollbar: React.FC<SizeScrollbarProps> = ({
  width = '100%',
  height = '100%',
  style,
  children,
}) => {
  const [state, setState] = React.useState<SizeScrollbarRenderProps>({
    width: 0,
    height: 0,
    scrollbarHeight: 0,
    scrollbarWidth: 0,
  });
  const div = React.useRef<HTMLDivElement>(null);
  const observer = React.useMemo(
    () =>
      new ResizeObserver(() => {
        setState({
          width: div.current?.offsetWidth ?? 0,
          height: div.current?.offsetHeight ?? 0,
          ...getScrollbarSize(),
        });
      }),
    [],
  );

  React.useEffect(() => {
    if (div.current) {
      observer.observe(div.current);
    }
    observer.observe(document.body);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [div.current]);

  return (
    <div style={{ ...style, width, height }} ref={div}>
      {state.width === 0 || state.height === 0 ? '' : children(state)}
    </div>
  );
};
