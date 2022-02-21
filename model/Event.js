
const db = require('../config/db')
const sanitizeHTML = require('sanitize-html');


let Event = function(data, files){
    this.data = data;
    this.errors = []
    this.files = files
    // this.organizerName = organizerName
    // this.userId = userId
    // this.requestedEventId = requestedEventId
}
 
Event.prototype.cleanup = function(req, res){
    if(typeof(this.data.eventLength) != "string"){this.data.eventLength = ""}
    if(typeof(this.data.eventName) != "string"){this.data.eventName = ""}
    if(typeof(this.data.eventPrice) != "string"){this.data.eventPrice = ""}
    if(typeof(this.data.difficulty) != "string"){this.data.difficulty = ""}
    if(typeof(this.data.distance) != "string"){this.data.distance = ""}
    if(typeof(this.data.groupSize) != "string"){this.data.groupSize = ""}
    if(typeof(this.data.distanceCover) != "string"){this.data.distanceCover = ""}
    if(typeof(this.data.pickupPoint) != "string"){this.data.pickupPoint = ""}
    if(typeof(this.data.language1) != "string"){this.data.language1 = ""}
    if(typeof(this.data.language2) != "string"){this.data.language2 = ""}
    if(typeof(this.data.language3) != "string"){this.data.language3 = ""}
    if(typeof(this.data.language4) != "string"){this.data.language4 = ""}
    if(typeof(this.data.itinerary) != "string"){this.data.itinerary = ""}
    if(typeof(this.data.accommodation) != "string"){this.data.accommodation = ""}
    // if(typeof(this.data.eventLength) != "string"){this.data.eventLength = ""}
    // if(typeof(this.data.organizerName) != "string"){this.data.organizerName = ""}

    let d = new Date();
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yyyy = d.getFullYear();
    let createdDate = `${dd}-${mm}-${yyyy}`;

    let sd = new Date(this.data.startingDate) ;
    let ld = new Date(this.data.lastDate) ;

    //starting date formating 
    let s_dd = sd.getDate();
    let s_mm = sd.getMonth() + 1;
    let s_yyyy = sd.getFullYear();
    let startingDate = `${s_dd}-${s_mm}-${s_yyyy}`;
    //last date formating
    let l_dd = ld.getDate();
    let l_mm = ld.getMonth() + 1;
    let l_yyyy = ld.getFullYear();
    let lastDate = `${l_dd}-${l_mm}-${l_yyyy}`;

    // event length calculation
    let dayLast = parseInt(l_dd) 
    let dayStart = parseInt(s_dd)
    let eventLength = dayLast - dayStart;  
    // console.log("date diff " +  eventLength)
 
    //storing an image filename in an array
    var thumbnailName = [] 
    var imagesName = [] 
    const imageFiles = this.files.images 
    const thumbnail = this.files.thumbnail
    thumbnail.forEach((thum, index, arr)=>{
        thumbnailName[index] = thum.filename
    })
    imageFiles.forEach((image, index, arr)=>{
         imagesName[index] = image.filename
    })
    
    this.data = {     
        eventName: sanitizeHTML(this.data.eventName, {allowedTags: [], allowedAttributes: {}}),
        organizer: sanitizeHTML(this.data.eventOrganizer, {allowedTags: [], allowedAttributes: {}}),
        eventLength: eventLength,
        eventPrice: sanitizeHTML(this.data.eventPrice, {allowedTags: [], allowedAttributes: {}}),
        difficulty: sanitizeHTML(this.data.difficulty, {allowedTags: [], allowedAttributes: {}}),
        distance: sanitizeHTML(this.data.distance, {allowedTags: [], allowedAttributes: {}}),
        startingDate: startingDate,
        lastDate: lastDate,
        groupSize:sanitizeHTML(this.data.groupSize, {allowedTags: [], allowedAttributes: {}}),
        distanceCover: sanitizeHTML(this.data.distanceCover, {allowedTags: [], allowedAttributes: {}}),
        pickupPoint: sanitizeHTML(this.data.pickupPoint, {allowedTags: [], allowedAttributes: {}}),
        departureTime: sanitizeHTML(this.data.departureTime, {allowedTags: [], allowedAttributes: {}}),
        language1: sanitizeHTML(this.data.language1, {allowedTags: [], allowedAttributes: {}}),
        language2: sanitizeHTML(this.data.language2, {allowedTags: [], allowedAttributes: {}}),
        language3: sanitizeHTML(this.data.language3, {allowedTags: [], allowedAttributes: {}}),
        language4: sanitizeHTML(this.data.language4, {allowedTags: [], allowedAttributes: {}}),
        mapLink: sanitizeHTML(this.data.mapLink, {allowedTags: [], allowedAttributes: {}}),
        h1: sanitizeHTML(this.data.h1, {allowedTags: [], allowedAttributes: {}}),
        h2: sanitizeHTML(this.data.h2, {allowedTags: [], allowedAttributes: {}}),
        h3: sanitizeHTML(this.data.h3, {allowedTags: [], allowedAttributes: {}}),
        h4: sanitizeHTML(this.data.h4, {allowedTags: [], allowedAttributes: {}}),
        h5: sanitizeHTML(this.data.h5, {allowedTags: [], allowedAttributes: {}}),
        itinerary: sanitizeHTML(this.data.itinerary, {allowedTags: [], allowedAttributes: {}}),
        isAccommodation: sanitizeHTML(this.data.isAccommodation, {allowedTags: [], allowedAttributes: {}}),
        accommodationDesc: sanitizeHTML(this.data.accommodationDesc, {allowedTags: [], allowedAttributes: {}}),
        isGuide: sanitizeHTML(this.data.isGuide, {allowedTags: [], allowedAttributes: {}}),
        guideDes: sanitizeHTML(this.data.guideDes, {allowedTags: [], allowedAttributes: {}}),
        isMeals: sanitizeHTML(this.data.isMeals, {allowedTags: [], allowedAttributes: {}}),
        mealsDesc: sanitizeHTML(this.data.mealsDesc, {allowedTags: [], allowedAttributes: {}}),
        isTransport: sanitizeHTML(this.data.isTransport, {allowedTags: [], allowedAttributes: {}}),
        transportDesc: sanitizeHTML(this.data.transportDesc, {allowedTags: [], allowedAttributes: {}}),
        isInsurance: sanitizeHTML(this.data.isInsurance, {allowedTags: [], allowedAttributes: {}}),
        insuranceDesc: sanitizeHTML(this.data.insuranceDesc, {allowedTags: [], allowedAttributes: {}}),
        isAdditionalServices: sanitizeHTML(this.data.isAdditionalServices, {allowedTags: [], allowedAttributes: {}}),
        additionalServicesDesc: sanitizeHTML(this.data.additionalServicesDesc, {allowedTags: [], allowedAttributes: {}}),        
        thumbnail: thumbnailName,
        images: imagesName,
        createdDate: createdDate,
        author: ""
    }
}

//validation
Event.prototype.validation = function(){
    
}

//create event model
Event.prototype.createEvent = function(){
    return new Promise(async(resolve, reject)=>{
        //validate user data
        this.cleanup();
        // console.log("organizer "+ this.data.organizer)
        // this.validate(); 

        //save to the database'
        if(!this.errors.length){
            let sql = `INSERT INTO events(
                eventName,
                organizer,
                eventLength,
                eventPrice,
                difficulty,
                distance,
                startingDate,
                lastDate,
                groupSize,
                distanceCover,
                pickupPoint,
                departureTime,
                language1,
                language2,
                language3,
                language4,
                mapLink,
                h1,
                h2,
                h3,
                h4,
                h5,
                itinerary,
                isAccommodation,
                accommodationDesc,
                isGuide,
                guideDes,
                isMeals,
                mealsDesc,
                isTransport,
                transportDesc,
                isInsurance,
                insuranceDesc,
                isAdditionalServices,
                additionalServicesDesc, 
                thumbnail,   
                images,
                createdDate,
                author
            )VALUES(
                '${this.data.eventName}' ,
                '${this.data.organizer}',
                '${this.data.eventLength}',
                '${this.data.eventPrice}',
                '${this.data.difficulty}',
                '${this.data.distance}',
                '${this.data.startingDate}',
                '${this.data.lastDate}',
                '${this.data.groupSize}',
                '${this.data.distanceCover}',
                '${this.data.pickupPoint}',
                '${this.data.departureTime}',
                '${this.data.language1}',
                '${this.data.language2}',
                '${this.data.language3}',
                '${this.data.language4}',
                '${this.data.mapLink}',
                '${this.data.h1}',
                '${this.data.h2}',
                '${this.data.h3}',
                '${this.data.h4}',
                '${this.data.h5}',
                '${this.data.itinerary}',
                '${this.data.isAccommodation}',
                '${this.data.accommodationDesc}',
                '${this.data.isGuide}',
                '${this.data.guideDes}',
                '${this.data.isMeals}',
                '${this.data.mealsDesc}',
                '${this.data.isTransport}',
                '${this.data.transportDesc}',
                '${this.data.isInsurance}',
                '${this.data.insuranceDesc}',
                '${this.data.isAdditionalServices}',
                '${this.data.additionalServicesDesc}',
                '${this.data.thumbnail}',
                '${this.data.images}',
                '${this.data.createdDate}',
                '${this.data.author}'
            )`
            db.query(sql, (err, result)=>{
                if(err)throw err
                
                resolve("success");
                console.log("event added")
           })
        }else{
            reject("failure")
        }
    }) 
} 

//read all events
Event.prototype.readEvent = function(){
    return new Promise(async(resolve, reject)=>{
        // this.cleanup() 
        // this.validation()
        let sql = `SELECT * FROM events`;
        db.query(sql, (err, result)=>{
            if(err){
                reject("Error occurred while loading event " + error)
            }else{
                resolve(result)
            }         
        }) 
    }) 
}

//read all events of specific organizer
Event.prototype.readOrganizerEvent = function(organizerName){
    return new Promise((resolve, reject)=>{
        
        let sql =  `SELECT * FROM events WHERE organizer = '${organizerName}'` 
         db.query(sql, (err, result)=>{
            if(err){
                reject("Error occurred while loading event " + err)
            }else{
                resolve(result)
            }
        })
    })
}

//read upcoming event  
Event.prototype.readUpcomingEvents = function(){
    return new Promise(async(resolve, reject)=>{
       
        // set current Date dd-mm-yyy format 
        let d = new Date();
        let dd = d.getDate();
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear(); 
        let currentDate = `${dd}-${mm}-${yyyy}`;

        let sql = `SELECT * FROM events WHERE startingDate >= '${currentDate}' `  
          db.query(sql, (err, result)=>{
            if(err){
                // throw err; 
                reject("Error Occured while loading event")
            }else{
                resolve(result)
            }
        })
    })
}

//reaad event by Id
Event.prototype.readSingleById  = function(id){
    return new Promise((resolve, reject)=>{
        let sql =  `SELECT * FROM events WHERE id = ?`
        db.query(sql,[id], (err, [result, _])=>{
            if(err){
                reject("something went wrong"+ err)
                
            }else{
                resolve(result)
            }
        })
    }) 
}


//read organizers active event
Event.prototype.readActiveEvents = function(organizerName){
    return new Promise((resolve, reject)=>{
        // set createdDate dd-mm-yyy format 
        let d = new Date();
        let dd = d.getDate();
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear(); 
        let currentDate = `${dd}-${mm}-${yyyy}`;

        let sql = `SELECT * FROM events WHERE organizer = '${organizerName}' AND startingDate >= '${currentDate}'`
        db.query(sql, (err, result)=>{
            if(err){
                // throw err
                 reject("Error occurred while loading event " + error)
            }else{
                resolve(result)
            }
        })
    })
}

//update envent
Event.prototype.update = function(id){
    return new Promise(async(resolve, reject)=>{
        try{
            let event = await this.readSingleById(id)
            if(event){
                //actually update the db
               let status = await this.actuallyUpdate(id)
                resolve(status)
            }else{
                reject()
            }
        }catch{
            reject()
        }
    })
}

Event.prototype.actuallyUpdate = function(id){
    return new Promise(async(resolve, reject)=>{
        this.cleanup()
        // this.validate()
        if(!this.errors.length){
            //actually update the db
            let sql = `UPDATE events SET 
            eventName = '${this.data.eventName}' ,
            organizer = '${this.data.organizer}',
            eventLength = '${this.data.eventLength}',
            eventPrice =  '${this.data.eventPrice}',
            difficulty = '${this.data.difficulty}',
            distance =  '${this.data.distance}',
            startingDate =  '${this.data.startingDate}',
            lastDate = '${this.data.lastDate}',
            groupSize = '${this.data.groupSize}',
            distanceCover = '${this.data.distanceCover}',
            pickupPoint = '${this.data.pickupPoint}',
            departureTime = '${this.data.departureTime}',
            language1 = '${this.data.language1}',
            language2 ='${this.data.language2}',
            language3 = '${this.data.language3}',
            language4 = '${this.data.language4}',
            mapLink = '${this.data.mapLink}',
            h1 =  '${this.data.h1}',
            h2 =  '${this.data.h2}',
            h3 =  '${this.data.h3}',
            h4 =   '${this.data.h4}',
            itinerary =  '${this.data.itinerary}',
            isAccommodation = '${this.data.isAccommodation}',
            accommodationDesc = '${this.data.accommodationDesc}',
            isGuide =  '${this.data.isGuide}',
            guideDes = '${this.data.guideDes}',
            isMeals = '${this.data.isMeals}',
            mealsDesc =  '${this.data.mealsDesc}',
            isTransport = '${this.data.isTransport}',
            transportDesc ='${this.data.transportDesc}',
            isInsurance =  '${this.data.isInsurance}',
            insuranceDesc = '${this.data.insuranceDesc}',
            isAdditionalServices = '${this.data.isAdditionalServices}',
            additionalServicesDesc = '${this.data.additionalServicesDesc}',
            thumbnail = '${this.data.thumbnail}',  
            images = '${this.data.images}',       
            createdDate = '${this.data.createdDate}',
            author = '${this.data.author}'

            WHERE id = ${id}`;
            db.query(sql, (err, result)=>{
                if(err){
                    throw err
                    // resolve("failure")
                }else{
                     resolve("success")
                }
            })
        }else{
            resolve("failure")
        }
    })
}

//delete
Event.prototype.deleteEvent = function(id) {
   
    return new Promise(async (resolve, reject)=>{
      try{
          let event = await this.readSingleById(id)
        //   conslole.log(event)
          if(event){
                let sql = `DELETE FROM events WHERE id = ${id}`;
                db.query(sql, (err, result)=>{
                    if(result){
                        resolve("success")
                    }else{
                        reject("failure")
                    }
                })  
            }else{
                reject("failure")
            }
        }catch{
          reject()
        }
    })
}

//count all events of an Organizer
Event.prototype.countEventForOrganizer = function(organizerName){
    return new Promise(async(resolve, reject)=>{
         // set current Date dd-mm-yyy format 
         let d = new Date();
         let dd = d.getDate();
         let mm = d.getMonth() + 1;
         let yyyy = d.getFullYear(); 
         let currentDate = `${dd}-${mm}-${yyyy}`;

        let sql = `SELECT COUNT(*) AS count from events WHERE organizer = '${organizerName}' UNION ALL
        SELECT COUNT(*) AS count from events WHERE organizer = '${organizerName}' AND startingDate >= '${currentDate}'`

        db.query(sql, (err, result)=>{
            if(err){
                // throw err 
                reject()
            }else{
                // console.log(result)
                resolve(result)
            }
        }) 
       
    })
}


module.exports = Event