const Stocks = [ 
    { 
        id : 1,
        name : "IOC",
        startPrice : 432,
        orders : [
            {
                id : 1,
                count : 84,
                value : 431,
                executed_at : new Date().getTime()
            },
            {
                id : 2,
                count : 84,
                value : 431,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 2,
        name : "ADANIGREEN",
        startPrice : 998,
        orders : [
            {
                id : 1,
                count : 1000,
                value : 997,
                executed_at : new Date().getTime()
            },
            {
                id : 2,
                count : 523,
                value : 998,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 3,
        name : "SBI",
        startPrice : 345,
        orders : [
            {
                id : 1,
                count : 972,
                value : 378,
                executed_at : new Date().getTime()
            },
            {
                id : 2,
                count : 283,
                value : 380,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 4,
        name : "AXIS",
        startPrice : 91,
        orders : [
            {
                id : 1,
                count : 35562,
                value : 100,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 2834,
                value : 101,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 5,
        name : "PNB",
        startPrice : 254,
        orders : [
            {
                id : 1,
                count : 3425,
                value : 345,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 4324,
                value : 355,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 6,
        name : "SJVN",
        startPrice : 1000,
        orders : [
            {
                id : 1,
                count : 3425,
                value : 990,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 4324,
                value : 890,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 7,
        name : "BHEL",
        startPrice : 530,
        orders : [
            {
                id : 1,
                count : 3425,
                value : 600,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 4324,
                value : 610,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 8,
        name : "BIOCON",
        startPrice : 2008,
        orders : [
            {
                id : 1,
                count : 3425,
                value : 990,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 4324,
                value : 890,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 9,
        name : "RIL",
        startPrice : 3000,
        orders : [
            {
                id : 1,
                count : 3425,
                value : 3203,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 4324,
                value : 3500,
                executed_at : new Date().getTime()+1
            }
        ]
    },
    { 
        id : 10,
        name : "IDEA",
        startPrice : 400,
        orders : [
            {
                id : 1,
                count : 3425,
                value : 500,
                executed_at : new Date().getTime()+1
            },
            {
                id : 2,
                count : 4324,
                value : 600,
                executed_at : new Date().getTime()+1
            }
        ]
    }
]

module.exports = Stocks;