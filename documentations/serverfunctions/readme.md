# ttps://docs.convex.dev/functions/mutation-functions

# client - tells the computer to download the javascrip, execute it and then hydrate the component, making the component interactive, using 'use cleint' directive doesn't mean it runs on the client side, but the rendering of component still happen in the server side as a static shell, because the users still need to see something, only when we interact with the compoent where the javascript will download and make interaction.

# server - server compnent renders only in the server side, no javascript is sent to the client, which means the bundle size stay small

# both runs in the server side, it's just the client side runs slower because it has to hydrate the javascript