if(process.env.NODE_ENV == "production"){
   //module.exports = {mongoURI: "mongodb+srv://blogApp:1234@cluster0-zduiu.mongodb.net/test?retryWrites=true&w=majority"}
   module.exports = { mongoURI: "mongodb+srv://admin:admin@cluster0-ntptw.mongodb.net/test?retryWrites=true&w=majority"}

}else{
    module.exports = {mongoURI:"mongodb://localhost/blogapps"}
}