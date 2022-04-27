//jshint esversion:6

const  express = require("express");
const bodyParse =require("body-parser");
const mongoose=require("mongoose");
 
 
const app=express();
const port=3000;

app.set('view engine', 'ejs');
 
app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema={
    name:String
};
const Item=mongoose.model("Item",itemsSchema);

const Item1= new Item({
    name:"Welcome to your todolist!"
});
const Item2= new Item({
    name:"Hit + button  to add a new item"
});
const Item3= new Item({
    name:"<--Hit this to delete an item"
});

const defaultItems = [Item1, Item2, Item3];

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List=mongoose.model("List", listSchema);

app.get("/",function(req,res){
     
    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Succesfully saved default items in DB.");
                }
            });
        res.redirect("/");
        }else{
            res.render("list",{ listTitle: "Today",newListItems: foundItems});
        }      
    });
});


app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundItems){
           //Creating a new list
            const list = new List({
            name:customListName,
            items:defaultItems
        });
        list.save();
        res.redirect("/");
            }else{
                //Showing an exixting list
                res.render("list",{ listTitle: foundList.name ,newListItems: foundList.item});
            }
        }
    });
    
});

app.post("/",function(req,res){
    let itemName=req.body.NewItem;
    const item=new Item({
        name:itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("Succesfully deleted checked item.");
            res.redirect("/");
        }
    });
});

app.get("/work",function(req,res){
    res.render("list",{ listTitle:"Work List",newListItems: WorkItems});
});

app.get("/about",function(req,res){
    res.render("about");
})

app.listen(port,function(){
    console.log("Server is on in port 3000");
});