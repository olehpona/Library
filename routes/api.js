var express = require('express');
var router = express.Router();
const pris = require('@prisma/client')
const prisma = new pris.PrismaClient()


router.get('/get_all_books' , async function(req, res, next) {
    let data = await prisma.book.findMany()
    res.header('Access-Control-Allow-Origin', "*");
    res.send({data : data})
})
router.get('/get_available_books', async function(req, res, next) {
    res.send(await prisma.student.findFirst({where: {
        email: "all@all"
        }}).books())
})

router.get('/get_all_students' , async function(req,res,next){
    let data = await prisma.student.findMany()
    res.send(data.slice(1))
})

router.post('/add_book', async function(req, res ,next){
    let data = req.body
    await prisma.student.update({
        where: {
            id:"64b6590e77269fc1f5b8fde5"
        },
        data: {
            books : {
                create :{
                    title: data.title,
                    author: data.author,
                    year : Number(data.year)
                }
            }

        }})
    res.send(200)
})

router.post('/delete_book' , async function(req,res,next){
    await prisma.book.delete({
        where : {
            id: req.body.id
        }
    })
    res.send('ok')
})

router.post('/update_book' , async function(req,res,next){
    let data = req.body
    await prisma.book.update({
        where: {
            id: data.id
        },
        data : {
            title : data.title,
            author: data.author,
            year: Number(data.year)
        }
    })
    res.send(200)
})
router.post('/update_student' , async function(req,res,next){
    let data = req.body
    console.log(data)
    await prisma.student.update({
        where: {
            id: data.id
        },
        data : {
            name : data.name,
            email: data.email,
            age: Number(data.age)
        }
    })
    res.send(200)
})
router.post('/add_student', async function(req, res ,next){
    let data = req.body
    await prisma.student.create({
        data: {
            name: data.name,
            email : data.email,
            age: Number(data.age)
        }})
    res.send(200)
})
router.post('/delete_student' , async function(req,res,next){
    await prisma.student.delete({
        where : {
            id: req.body.id
        }
    })
    res.send('ok')
})
router.post('/take_book' , async function(req,res,next){
        let data =req.body;
        let student = data.value.split(' | ');
        let student_id = await prisma.student.findFirst({where:{
                email: student[1],
                name : student[0]
            }})
        console.log(data)
        await prisma.student.update({
            where:{
                id: student_id.id
            },
            data : {
                books:{
                    connect:{
                        id: data.book_id
                    }
                }
            }
        })
    await prisma.book.update({
        where: {
            id: data.book_id
        },
        data : {
            took: true
        }
    })
})
router.post('/get_student_books' , async function(req,res,next){
    let student_id = req.body.id
    let data = await prisma.book.findMany({
        where : {
            studentId : student_id
        }
    })
    res.send(data)
})
router.post('/disconnect_book' , async function(req,res,next){
    let book_id = req.body.book_id
    await prisma.student.update({
        where:{
            id: "64b6590e77269fc1f5b8fde5"
        },
        data : {
            books:{
                connect:{
                    id: book_id
                }
            }
        }
    })
    await prisma.book.update({
        where: {
            id: book_id
        },
        data : {
            took: false
        }
    })
    res.send(200)
})
module.exports = router;