import React from 'react';
import { throttle } from 'lodash-es';

export type SizeRenderProps = { width: number; height: number };

export type SizeProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
> & {
  width?: string | number;
  height?: string | number;
  children: (state: SizeRenderProps) => React.ReactNode;
};

export const Size: React.FC<SizeProps> = ({ width = '100%', height = '100%', style, children }) => {
  const [state, setState] = React.useState<SizeRenderProps>({
    width: 0,
    height: 0,
  });
  const div = React.useRef<HTMLDivElement>(null);

  const measure = React.useCallback(() => {
    return {
      width: div.current?.offsetWidth || 0,
      height: div.current?.offsetHeight || 0,
    };
  }, [div.current]);

  React.useEffect(() => {
    const handleResize = throttle(() => setState(measure()), 166); // 10 frames at 60 Hz
    window.addEventListener('resize', handleResize);
    div.current?.addEventListener('resize', handleResize);
    setState(measure());

    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
      div.current?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ ...style, width, height }} ref={div}>
      {state.width === 0 || state.height === 0 ? '\u00A0' : children(measure())}
    </div>
  );
};
