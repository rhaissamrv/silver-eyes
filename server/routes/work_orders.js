const express = require('express')
const router = express.Router()
const Work_Order = require('../model/Work_Order')

/*router.get('/', checkAuthentication, async (req, res) => {
    let data = await Work_Order.find({})
    res.send(data)
})

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        console.log('not logged in')
        res.redirect('/')
    }
}*/

router.get('/', async (req, res) => {
    let data
    try {
        data = await Work_Order.find({}).sort({date:1})
    } catch (err) { 
        const error = 'Fetching items failed'
        return next(error)
    }
    res.json({
        flights: data
    })
})



//GET all work_orders from a specific Customer
router.get('/:user', async (req, res, next) => {
    const userInfo = req.params.user
    // console.log('userInfo:', userInfo)
    let userFlights
    try {
        userFlights = await Work_Order.find({ customerName: userInfo }).sort({date:1})
    } catch (err) {
        const error = 'Fetching items failed'
        return next(error)
    }
    if (!userFlights || userFlights.length === 0) {
        const error = 'Could not find flights for this user'
        return next(error)
    }
    // console.log('userFlights:', userFlights)
    res.json({
        flights: userFlights.map((flights) =>
            flights.toObject({ getters: true })
        )
    })
})


//GET one work_order by ID
router.get('/work_order/:id', async (req, res, next) => {
    const flightId = req.params.id
    // console.log('flightId:', flightId)
    let flightById
    try {
        flightById = await Work_Order.findOne({ _id: flightId })
    } catch (err) {
        const error = 'Fetching work order failed'
        return next(error)
    }
    // console.log('flightById:', flightById)
    res.json({
        flight: flightById.toObject({ getters: true })
    })
})

//GET all flights from a specific Pilot

router.get('/pilot/:pilot', async (req, res, next) => {
    const pilot = req.params.pilot
    // console.log('pilot:', pilot)
    let pilotFlights;
    try{
        pilotFlights = await Work_Order.find({ pilot: pilot}).sort({date:1})
    } catch (err) {
        const error = 'Fetching pilot flights failed'
        return next(error)
    }
    // console.log("pilotFlights:", pilotFlights)
    res.json({
        flights: pilotFlights
    })
})

// POST method route
// Am I doing this right? NO

router.post('/create', async function (req, res) {
    // res.status(418).send("I'm a teapot.")
    console.log(`Create object endpoint OK. `)

    const newFlight = req.body

    try {
        // something happens
        let newEntry = new Work_Order(newFlight)
        await newEntry.save()
        res.send(newEntry)
    } catch (err) {
        // something bad happens
        console.log(err)
        res.sendStatus(500)
    }
})

router.patch('/work_order/:id', async (req, res, next) => {
    const fieldsToUpdate = req.body
    const workOrderId = req.params.id

    let workOrder
    try {
        workOrder = await Work_Order.findById(workOrderId);
      } catch (err) {
        console.log("error:", err)
        return next(err);
      }

    // update only fields that are included in the body of the request  
    if (fieldsToUpdate) {
        // make an array of the fields which are to be updated
        const fields = Object.keys(fieldsToUpdate)
        // update only those fields in the database record
        fields.map((field)=>{workOrder[field] = fieldsToUpdate[field]})  
    }    
      try {
        await workOrder.save();
      } catch (err) {
        console.log("error:", err)
        return next(err);
      }
      res.status(200).json({ workOrder: workOrder.toObject({ getters: true }) });
    })
 
    router.patch('/work_order/update/:id', async (req, res, next) => {
        const fieldsToUpdate = req.body
        const workOrderId = req.params.id
        // console.log('workOrderId:', workOrderId)
        console.log('fieldsToUpdate:', fieldsToUpdate)
    
        let workOrder
        try {
            workOrder = await Work_Order.findById(workOrderId);
        } catch (err) {
          console.log("error:", err)
          return next(err);
        }
    
        workOrder.flight_plan = fieldsToUpdate.flight_plan
        workOrder.flight_data = fieldsToUpdate.flight_data
        workOrder.status = fieldsToUpdate.status
        workOrder.jobTitle = fieldsToUpdate.jobTitle
        workOrder.jobNumber= fieldsToUpdate.jobNumber
        workOrder.jobDetails = fieldsToUpdate.jobDetails
        workOrder.clientContact = fieldsToUpdate.clientContact
        workOrder.clientEmail = fieldsToUpdate.clientEmail
        workOrder.customerName = fieldsToUpdate.customerName
    
        // console.log("workOrder.videoURL:", workOrder.videoURL)
        console.log("workOrder", workOrder)
          try {
            await workOrder.save();
          } catch (err) {
            console.log("error:", err)
            return next(err);
          }
          res.status(200).json({ workOrder: workOrder.toObject({ getters: true }) });
        }
)

router.delete('/work_order/:id/delete', async (req, res, next) => {
    const workOrderId = req.params.id

    let workOrder
    try {
        workOrder = await Work_Order.findByIdAndDelete(workOrderId);
      } catch (err) {
        console.log("error:", err)
        return next(err);
      }

      res.status(200).json({ workOrder: workOrder.toObject({ getters: true }) });
    }
    

)


module.exports = router
