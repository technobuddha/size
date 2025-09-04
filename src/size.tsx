import React from 'react';

export type SizeRenderProps = { width: number; height: number };

export type SizeProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
> & {
  readonly width?: string | number;
  readonly height?: string | number;
  children(this: void, props: SizeRenderProps): React.ReactNode;
};

export const Size: React.FC<SizeProps> = ({ width = '100%', height = '100%', style, children }) => {
  const [state, setState] = React.useState<SizeRenderProps>({
    width: 0,
    height: 0,
  });
  const div = React.useRef<HTMLDivElement>(null);
  const observer = React.useMemo(
    () =>
      new ResizeObserver(() => {
        setState({
          width: div.current?.offsetWidth ?? 0,
          height: div.current?.offsetHeight ?? 0,
        });
      }),
    [],
  );

  React.useEffect(() => {
    if (div.current) {
      observer.observe(div.current);
    }
    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [div.current]);

  const Children = children;

  return (
    <div style={{ ...style, width, height }} ref={div}>
      {state.width === 0 || state.height === 0 ?
        '\u00A0'
      : <Children width={state.width} height={state.height} />}
    </div>
  );
};
