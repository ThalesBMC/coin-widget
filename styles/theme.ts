import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const styles = {
  global: (props: any) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("white", "blackAlpha.600")(props),
    },
  }),
};

const theme = extendTheme({ config, styles });

export default theme;
