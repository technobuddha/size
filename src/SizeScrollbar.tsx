import React from 'react';
import { throttle } from 'lodash-es';

const getScrollbarSize = () => {
  const node = document.createElement('div');
  node.setAttribute(
    'style',
    'width: 100px; height: 100px; position: absolute; top: -1000000px; overflow: scroll;',
  );
  document.body.appendChild(node);

  const scrollbarWidth = node.offsetWidth - node.clientWidth;
  const scrollbarHeight = node.offsetHeight - node.clientHeight;

  document.body.removeChild(node);

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
  width?: string | number;
  height?: string | number;
  children: (state: SizeScrollbarRenderProps) => React.ReactNode;
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

  const measure = React.useCallback(() => {
    return {
      width: div.current?.offsetWidth || 0,
      height: div.current?.offsetHeight || 0,
      ...getScrollbarSize(),
    } as SizeScrollbarRenderProps;
  }, [div.current]);

  React.useEffect(() => {
    const handleResize = throttle(() => setState(measure()), 166); // 10 frames at 60 Hz
    window.addEventListener('resize', handleResize);
    div.current?.addEventListener('resize', handleResize);
    setState(measure());

    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
      div.current?.removeEventListener('reisze', handleResize);
    };
  }, []);

  return (
    <div style={{ ...style, width, height }} ref={div}>
      {state.width === 0 || state.height === 0 ? '' : children(measure())}
    </div>
  );
};
