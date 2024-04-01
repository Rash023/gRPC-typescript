import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoloader from "@grpc/proto-loader";
import {ProtoGrpcType} from "./proto/random";
import {RandomHandlers} from "./proto/randomPackage/Random"
import { TodoResponse } from './proto/randomPackage/TodoResponse';
import { ChatRequest } from './proto/randomPackage/ChatRequest';
import { ChatResponse } from './proto/randomPackage/ChatResponse';


const PORT=8082
const PROTO_FILE="./proto/random.proto"

const packageDef=protoloader.loadSync(path.resolve(__dirname,PROTO_FILE))
const grpcObject=(grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const randomPackage=grpcObject.randomPackage


function main(){
    const server=getServer()
    server.bindAsync(`0.0.0.0:${PORT}`,grpc.ServerCredentials.createInsecure(),
    (err,port)=>{
        if(err){
            console.log(err)
            return
        }
        console.log(`your server has started on ${port}`)

        server.start()
    })
}




const todoList:TodoResponse ={data:[]}
const  callObjByUsername=new Map<string,grpc.ServerDuplexStream<ChatRequest,ChatResponse>>()
function getServer(){
    const server=new grpc.Server()
    server.addService(randomPackage.Random.service, {
        PingPong:(req,res)=>{
            console.log(req.request)
            res(null,{"message":"Pong"})

        },
        RandomNumbers:(call)=>{
            const {maxVal=10}=call.request
            console.log(maxVal)
            let runCount=0

            const id=setInterval(()=>{
                runCount= ++runCount
                call.write({num:Math.floor(Math.random()*maxVal)})


                if(runCount>=10){
                    clearInterval(id)
                    call.end()
                }
                
            },500)
            
        },
        TodoList:(call,callback)=>{
            call.on("data",(chunk)=>{
                todoList.data?.push(chunk)
                console.log(chunk)
            })

            call.on("end",()=>{
                callback(null,{data:todoList.data})
            })
        },
        Chat: (call) => {
            call.on("data", (req) => {
              const username = call.metadata.get('username')[0] as string
              const msg = req.message
              console.log(req)
      
      
              for(let [user, usersCall] of callObjByUsername) {
                if(username !== user) {
                  usersCall.write({
                    username: username,
                    message: msg
                  })
                }
              }
      
              if (callObjByUsername.get(username) === undefined) {
                callObjByUsername.set(username, call)
              }
            })
      
            call.on("end", () => {
              const username = call.metadata.get('username')[0] as string
              callObjByUsername.delete(username)
              for(let [user, usersCall] of callObjByUsername) {
                  usersCall.write({
                    username: username,
                    message: "Has Left the Chat!"
                  })
              }
              console.log(`${username} is ending their chat session`)
      
              call.write({
                username: "Server",
                message: `See you later ${username}`
              })
      
              call.end()
            })  
      
          }
        } as RandomHandlers)
    return server
}

main()
