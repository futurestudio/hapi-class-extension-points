'use strict'

declare module '@hapi/hapi' {
    interface Server {
        /**
         * Register a list of classes each providing individual extension points.
         *
         * @param classes {Class|Array}
         */
        extClass(...classes): void;
    }
}
