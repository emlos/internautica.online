var lastBuild = false;
if (process.env.INTERNAUTICA_ENV == "deploy"){
    lastBuild = Date.now()
}


module.exports = {
    lastBuildDate : lastBuild ,
    excludedTags: ["news", "post", "pages", "all", "shrine"],
};
