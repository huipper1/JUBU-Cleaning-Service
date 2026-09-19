import { JubuIcon, type JubuIconProps } from "@/components/icons";

export type IconProps = JubuIconProps;

export function Icon(props: IconProps) {
  return <JubuIcon {...props} />;
}
