import {
  graphql,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const videoList = new GraphQLObjectType({
  name : "VideoType",
  fields: () => ({
    id: {
      type : GraphQLNonNull(GraphQLInt),
    },  
    video_id: {
      type : GraphQLNonNull(GraphQLString),
    },  
    title: {
      type : GraphQLNonNull(GraphQLString),
    },  
    description: {
      type : GraphQLNonNull(GraphQLString),
    },  
    thumbnail: {
      type : GraphQLNonNull(GraphQLString),
    },  
    published_date: {
      type : GraphQLNonNull(GraphQLString),
    },  
  })
})

const linksObject = new GraphQLObjectType({
  name : "LinksType",
  fields : () => ({
    nextPage : {
      type : GraphQLString
    },
    prevPage : {
      type : GraphQLString
    }
  })
})

const VideoResponseType = new GraphQLObjectType({
  name: "VideoResponse",
  description:
    "This represents the response of video according to the title passed",
  fields: () => ({
    _links: {
      type: linksObject,
    },
    page: { type: GraphQLNonNull(GraphQLInt) },
    data: {
      type: GraphQLList(videoList),
    },
  }),
});

export {VideoResponseType , videoList}
