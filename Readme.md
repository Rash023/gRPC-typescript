# gRPC

This repository contains implementations of gRPC using different communication modes: Unary RPC, Server Streaming RPC, Client Streaming RPC, and Bidirectional Streaming RPC. Each implementation showcases how to utilize gRPC in various scenarios, extending the context of distributed systems development.

## Unary RPC

The Unary RPC implementation demonstrates a simple request-response model, where the client sends a single request to the server and receives a single response. It showcases basic interaction between client and server, suitable for scenarios such as fetching data or executing computations.

## Server Streaming RPC

The Server Streaming RPC implementation showcases how the server can send a stream of messages in response to a single client request. This implementation is ideal for scenarios requiring the server to send multiple responses to a single client request, such as real-time data feeds or log streaming.

## Client Streaming RPC

The Client Streaming RPC implementation demonstrates how the client can send a stream of messages to the server, which processes the messages and sends a single response back to the client. It is suitable for scenarios where the client needs to send a large amount of data to the server, such as uploading files or batch processing.

## Bidirectional Streaming RPC

The Bidirectional Streaming RPC implementation showcases simultaneous communication between the client and server, allowing both to send a stream of messages to each other. This implementation is useful for scenarios requiring continuous communication, such as real-time collaborative editing or chat applications.

## License

[MIT](https://choosealicense.com/licenses/mit/)
