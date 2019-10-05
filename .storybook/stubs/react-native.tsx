/**
 * work around some third party libraries incorrectly relying  on react-native being
 * a commonjs module and therefore that babel's interop default import will apply
 */
export * from "react-native-web";
import * as rn from "react-native-web";

export default rn;
