const path = require("path");
const webpack = require("webpack");

module.exports = async ({ config }) => {
  // Set globals
  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: false
    })
  );

  config.module.rules.push(
    // compile
    {
      test: /\.jsx?$/,
      include: [path.resolve("node_modules")],
      exclude: /node_modules\/react-native-web\//,
      use: {
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: false,
          configFile: false,
          presets: ["module:metro-react-native-babel-preset"],
          plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
        }
      }
    },
    {
      test: /\.(ts|tsx)$/,
      loaders: [
        {
          loader: require.resolve("awesome-typescript-loader"),
          options: {
            transpileOnly: true,
            configFileName: require.resolve("./tsconfig.json")
          }
        }
      ]
    }
  );

  config.resolve.extensions.unshift(".web.js", ".ts", ".tsx");

  // Alias incompatible modules with either a react-native-web compatible shim,
  // or a stub module where none exists
  config.resolve.alias = {
    ...(config.resolve && config.resolve.alias),
    expo: require.resolve("expo-web"),
    "@expo/vector-icons": require.resolve("expo-web"),
    "react-native": require.resolve("./stubs/react-native.tsx"),
    // referenced from expo-web's icon stub, but doesn't seem to exist
    "react-native-vector-icons/AntDesign": require.resolve("./stubs/empty-module.ts"),
    "react-native-svg": require.resolve("react-native-svg-web"),
    "react-native-video": require.resolve("./stubs/react-native-video.tsx"),
    "react-navigation": require.resolve("@react-navigation/core"),
    "sentry-expo": require.resolve("./stubs/empty-module.ts")
  };

  return config;
};
