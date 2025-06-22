"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpubReaderRef = exports.EpubReader = void 0;
const expo_1 = require("expo");
const App_1 = __importDefault(require("./App"));
// Export the EpubReader component and the interface for use as a library
var EpubReader_1 = require("./components/EpubReader");
Object.defineProperty(exports, "EpubReader", { enumerable: true, get: function () { return __importDefault(EpubReader_1).default; } });
Object.defineProperty(exports, "EpubReaderRef", { enumerable: true, get: function () { return EpubReader_1.EpubReaderRef; } });
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
(0, expo_1.registerRootComponent)(App_1.default);
