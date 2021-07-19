module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/jira-api-automation-frontend/"
      : "/",
};
