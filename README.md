# backend

Data Base Server used : MongoDB Atlas (Amazon Server Free tier) 

API to upload image in DB :-  localhost:3000/images (post) JSON body
{
    name:text
    image:file
}

API to fetch image from DB :- localhost:3000/images/:imageId (get) Path Variables key:imageId
value _id
 
API to replace the image in DB :- localhost:3000/images/:imageId (patch)
API to delete the image from DB :- localhost:3000/images/:imageId (delete)


JWT authenticated signup API using contact number :- localhost:3000/user/login (post)


JWT authenticated login API using contact number :- localhost:3000/user/signup (post)

{
    contact:number
}
