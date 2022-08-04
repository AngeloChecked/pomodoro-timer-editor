import MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
import HtmlWebpackPlugin = require("html-webpack-plugin");
import CopyPlugin = require("copy-webpack-plugin");
export namespace entry {
    const entry_1: string;
    export { entry_1 as entry };
}
export namespace output {
    const path: string;
    const filename: string;
}
export namespace resolve {
    const extensions: string[];
}
export namespace module {
    const rules: ({
        test: RegExp;
        use: string[];
        exclude?: undefined;
        type?: undefined;
    } | {
        test: RegExp;
        use: string;
        exclude?: undefined;
        type?: undefined;
    } | {
        test: RegExp;
        use: string;
        exclude: RegExp;
        type?: undefined;
    } | {
        test: RegExp;
        type: string;
        use?: undefined;
        exclude?: undefined;
    })[];
}
export const plugins: (MonacoWebpackPlugin | HtmlWebpackPlugin | CopyPlugin)[];
