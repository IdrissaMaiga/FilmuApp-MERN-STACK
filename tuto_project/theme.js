import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";


 const config= {
    initialColorMode: 'system', // Use system color mode by default
    useSystemColorMode: true, // Allow the theme to follow system preferences
  };


const styles = {
  global: (props) => ({
    body: {
      bg: mode(
        props.theme.semanticTokens.colors["chakra-body-bg"]._light,
        "blackAlpha.900"
      )(props),
    },
  }),
};

const theme = extendTheme({ config, styles });

export default theme;
