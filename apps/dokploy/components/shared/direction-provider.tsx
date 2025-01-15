import { Direction } from "@radix-ui/react-accordion";
import { DirectionProvider } from "@radix-ui/react-direction";

export default ({children, dir}: {children: React.ReactElement, dir: Direction}) => {
  return (
  <DirectionProvider dir={dir}>
    {children}
  </DirectionProvider>);
}
