import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLInt,
  } from 'graphql';

import {VideoResponseType,videoList} from '../types/rootTypes';
import { getAllVideos, getVideosByTitle } from '../../controllers/videoController';


const VideosQueryRootType = new GraphQLObjectType({
    name : "VideosQuery",
    description : 'Videos Query Root',
    fields : () => ({
        videosByTitle : {
            type : VideoResponseType,
            description : "Get All Videos Through the title",
            args: {
                title: { type: GraphQLString },
                page: { type: GraphQLInt},
                limit: { type: GraphQLInt },
            },
            resolve(parentValue,args){
                return getVideosByTitle(args.title,args.page,args.limit)
            },
        },
        getAllVideos : {
            type : GraphQLList(videoList),
            description : "Get All Videos",
            resolve(){
                return getAllVideos()
            },
        }
    })
})


export default VideosQueryRootType