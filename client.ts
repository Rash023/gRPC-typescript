import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoloader from "@grpc/proto-loader";
import {ProtoGrpcType} from "./proto/random";
import readline from 'readline';



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
    client for unary rpc
    client.PingPong({message:"Ping"},(err,result)=>{
        if(err){
            console.log(err)
            return
        }

        console.log(result)
    })

    //client for server streaming rpc
    const stream1=client.randomNumbers({maxVal:85})
    stream1.on("data",(chunk)=>{
        console.log(chunk)

    })

    stream1.on("end",()=>{
        console.log("Communication ended")
    })

    
    //client for client streaming rpc
    const stream2=client.TodoList((err,result)=>{
        if(err){
            console.log(err)
        }

        console.log(result)

    })

    stream2.write({todo:"Walk the wife",status:"Never"})
    stream2.write({todo:"Walk the Dog",status:"Pending"})
    stream2.write({todo:"Compiler Design",status:"Done"})
    stream2.write({todo:"Creating grpc",status:"Ongoing"})
    stream2.end()


    //client for bidirectional streaming
    const r1=readline.createInterface({
        input:process.stdin,
        output:process.stdout
    })

    const username=process.argv[2]
    if(!username) console.error("No username ,can't join the chat"), process.exit()
    const metadata=new grpc.Metadata()  
    
    metadata.set("username",username)
    const call=client.Chat(metadata)


    call.write({
        message:"register"
    })

    call.on("data",(chunk)=>{
        console.log(`${chunk.username}==> ${chunk.message}`)
    })

  

    r1.on("line",(line)=>{
        if(line=="quit"){
            call.end()
            return
        }
        else{
            call.write({
                message:line
            })
        }
    })


}