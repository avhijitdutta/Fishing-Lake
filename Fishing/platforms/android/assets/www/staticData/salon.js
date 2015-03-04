var tabs=[
{
    name: 'Coarse',
    active:"images/ico-coarse-active.png",
    inactive:"images/ico-coarse-inactive.png",
    id:1,
    state:true
},
{
    name: 'Game',
    active:"images/ico-game-active.png",
    inactive:"images/ico-game-inactive.png",
    id:2,
    state:true
},
{
    name: 'Tackle Shop',
    active:"images/ico-ts-active.png",
    inactive:"images/ico-ts-inactive.png",
    id:3,
    state:true
}];

var collection=[
    {
        id:1,
        name:"The Best in the midlands",
        url:"images/listing_img1.jpg",
        noOfLocation:7
    },
    {
        id:2,
        name:"The best for carp",
        url:"images/listing_img1.jpg",
        noOfLocation:6
    },
    {
        id:3,
        name:"Most Review",
        url:"images/listing_img1.jpg",
        newReview:true,
        noOfLocation:5
    }
]

var lacks=[
    {
        id:1,
        name:"Himalaya Hall Top Pool",
        url:"images/listing_img1.jpg",
        collection_id:1,
        rating:"4.5",
        type:"Coarse",
        review:10,
        photo:5,
        distance:"12.5 Miles",
        place:"WOLVERHAMPTON"
    },
    {
        id:2,
        name:"Delhi Hall Top Pool",
        url:"images/listing_img1.jpg",
        collection_id:1,
        rating:"3.5",
        type:"Game",
        review:4,
        photo:1,
        distance:"19.5 Miles",
        place:"DELHI"
    },
    {
        id:3,
        name:"Kolkata Hall Top Pool",
        url:"images/listing_img1.jpg",
        collection_id:1,
        rating:"3.5",
        type:"Game",
        review:2,
        photo:2,
        distance:"1.5 Miles",
        place:"DELHI"
    }
]

var facilites=[
    {name:"Wheel chair access",active:true,id:1},
    {name:"Peg Types (platforms / bank / gravel)",active:true,id:2},
    {name:"Rod licence required",active:false,id:3},
    {name:"Parking",active:true,id:4},
    {name:"Toilets",active:false,id:5},
    {name:"Café",active:false,id:6},
    {name:"Camping",active:false,id:7},
    {name:"Tackle hire",active:true,id:8},
    {name:"Bait / tackle shop",active:false,id:9},
    {name:"Children allowed",active:true,id:10},
    {name:"Fires / BBQ",active:true,id:11},
    {name:"Dogs",active:true,id:12},
    {name:"Boat hire",active:false,id:13},
    {name:"Hire for Competition",active:true,id:14}
];

var fishingRules=[
    {name:"Environmental Agency Rod",active:true,id:1},
    {name:"License Required",active:true,id:2},
    {name:"Night fishing",active:false,id:3},
    {name:"Pellets",active:true,id:4},
    {name:"Boilies",active:false,id:5},
    {name:"Ground bait",active:false,id:6},
    {name:"Keep nets",active:false,id:7},
    {name:"barbless hooks",active:true,id:8},
    {name:"More than 1 Rod",active:false,id:9},
    {name:"Bait in Tins",active:true,id:10},
    {name:"Bait Boats",active:true,id:11},
    {name:"Nuts",active:true,id:12},
    {name:"Floating baits",active:false,id:13},
    {name:"Wading",active:true,id:14},
    {name:"Catch and release",active:false,id:15},
    {name:"Fires",active:true,id:16},
    {name:"BBQ",active:false,id:17},
    {name:"Children Under 16",active:true,id:18},
    {name:"Method Feeder",active:false,id:19},
    {name:"Cat and Dog Food",active:false,id:20},
    {name:"Braided Lines",active:true,id:21},
    {name:"Fixed Lead",active:true,id:22},
    {name:"Swim Fishing Only",active:false,id:23},
    {name:"Alchohol",active:true,id:24},
    {name:"Unhooking Mat",active:false,id:25}
];

var fishSpecies=[
    {name:"Specimen",active:false,id:1,specimen:true},
    {name:"License Required",active:true,id:2,specimen:true},
    {name:"Night fishing",active:false,id:3,specimen:false},
    {name:"Pellets",active:false,id:4,specimen:true},
    {name:"Boilies",active:true,id:5,specimen:false},
    {name:"Ground bait",active:true,id:6,specimen:true},
    {name:"Keep nets",active:true,id:7,specimen:false},
    {name:"Barbless hooks",active:false,id:8,specimen:true},
    {name:"More than 1 Rod",active:true,id:9,specimen:true},
    {name:"Bait in Tins",active:false,id:10,specimen:false},
    {name:"Bait Boats",active:true,id:11,specimen:true},
    {name:"Nuts",active:false,id:12,specimen:false},
    {name:"Floating baits",active:true,id:13,specimen:true},
    {name:"Wading",active:false,id:14,specimen:true},
    {name:"Catch and release",active:false,id:15,specimen:true},
    {name:"Fires",active:false,id:16,specimen:false},
    {name:"BBQ",active:true,id:17,specimen:true},
    {name:"Children Under 16",active:true,id:18,specimen:true},
    {name:"Method Feeder",active:false,id:19,specimen:true},
    {name:"Cat and Dog Food",active:true,id:20,specimen:true},
    {name:"Braided Lines",active:false,id:21,specimen:true},
    {name:"Method Feeder",active:false,id:22,specimen:true},
    {name:"Fixed Lead",active:false,id:23,specimen:false},
    {name:"Swim Fishing Only",active:false,id:24,specimen:true},
    {name:"Alchohol",active:true,id:25,specimen:true},
    {name:"Unhooking Mat",active:true,id:25,specimen:false}
]