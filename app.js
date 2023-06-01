const express = require("express");
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require('mongoose');
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')
mongoose.connect('mongodb+srv://habeeb:5qVfu4mImk2AtP0D@cluster0.ycdqxoa.mongodb.net/tododb?retryWrites=true&w=majority');
const Itemschema={
    name:String
}
const Item = mongoose.model('Item', Itemschema);
const ItemListschema={
    name:String,
    itemList:[Itemschema]
}
const ItemList = mongoose.model('ItemList', ItemListschema);

app.get("/", function (req, res) {
    let day = date.getDate();
    Item.find()
        .then((items) => {
            res.render("index", { dayOfWeek: day, itemList: items })
        })
        .catch((err) => {
            console.log(err);
        })
})
app.post("/", (req, res) => {
    let item = req.body.newItem;
    let list=req.body.listName;
    if (item) {
        const itemOne = new Item({
            name: item
        });
        ItemList.findOne({name:list})
            .then((foundItem) => {
                foundItem.itemList.push(itemOne)
                foundItem.save();
                res.redirect("/"+list);
            })
            .catch((err) => {
                console.log(err);
            })
    }
})
app.post("/delete",(req,res)=>{
    let name=req.body.check1
    let listName=req.body.listname;
    ItemList.findOne({name:listName})
            .then((foundItem) => {
                foundItem.deleteOne({itemList:name})
                res.redirect("/"+listName);
            })
            .catch((err) => {
                console.log(err);
            })
})
app.get("/:listName",(req,res)=>{
    const list=req.params.listName;
    ItemList.findOne({name:list})
    .then((result) => {
        if(!result){
            const newItemList=new ItemList({
                name:list
            })  
            newItemList.save();
            res.redirect("/"+list)
        }
        else{
            res.render("index", { dayOfWeek: result.name, itemList: result.itemList })
        }
    })
    .catch((err) => {
        console.log(err);
    })
})
app.listen(3000, () => {
    console.log("app running on 3000")
})