// global declarations to satisfy TypeScript when type packages are missing
// this file prevents errors like "Cannot find module 'react'" or missing JSX types.


declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
