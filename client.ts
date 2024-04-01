import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoloader from "@grpc/proto-loader";
import {ProtoGrpcType} from "./proto/random";


const PORT=8082
const PROTO_FILE="./proto/random.proto"

const packageDef=protoloader.loadSync(path.resolve(__dirname,PROTO_FILE))
const grpcObject=(grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType


const client= new grpcObject.randomPackage.Random(
    `0.0.0.0:${PORT}`,grpc.credentials.createInsecure()
)

const deadline=new Date()
deadline.setSeconds(deadline.getSeconds()+5)
client.waitForReady(deadline,(err)=>{
    if(err){
        console.log(err)
        return
    }
    onClientReady()
})

function onClientReady(){
    //client for unary rpc
    // client.PingPong({message:"Ping"},(err,result)=>{
    //     if(err){
    //         console.log(err)
    //         return
    //     }

    //     console.log(result)
    // })

    //client server streaming rpc
    // const stream=client.randomNumbers({maxVal:85})
    // stream.on("data",(chunk)=>{
    //     console.log(chunk)

    // })

    // stream.on("end",()=>{
    //     console.log("Communication ended")
    // })

    //client for client streaming rpc

    const stream=client.TodoList((err,result)=>{
        if(err){
            console.log(err)
        }

        console.log(result)

    })

    stream.write({todo:"Walk the wife",status:"Never"})
    stream.write({todo:"Walk the Dog",status:"Pending"})
    stream.write({todo:"Compiler Design",status:"Done"})
    stream.write({todo:"Creating grpc",status:"Ongoing"})
    stream.end()


}