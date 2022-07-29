/* eslint-disable camelcase */
/**
 * Controller file to handle all the business logics
 */
const path = require('path');
const { Logger, Utility } = require('../helpers/index');
const { cards } = require('../api/index');
const {
  watchersModel,
  staredModel,
  issuesModel,
  commitsModel,
  clonesModel,
  pullrequestModel,
  viewsModel,
  actionsModel,
  forksModel,
  releaseModel,
  commentsModel,
  licenseModel,
  tagsModel,
  languageModel,
  repoTreeModel
} = require('../models/index');

/**
 * Handle watchers card data
 *
 * @function GetWatchers
 * @param {object} opts
 * @returns {object} - returns watchers data
 * @author dev-team
 */
const GetWatchers = async opts => {
  try {
    let { list } = await watchersModel.GetWatchersFromDB(opts);
    list = await Utility.CountDiffCalculation(list);
    const count = await Utility.CalculateCountFromObject(list, opts.since, opts.until);
    let result = { count };

    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(list, opts, timeRange, 'getwatchers');
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetWatchers in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Starred card data
 *
 * @function GetStargazers
 * @param {object} opts
 * @returns {object} - returns starred data
 * @author dev-team
 */
const GetStargazers = async opts => {
  try {
    const { list } = await staredModel.GetStaredFromDB(opts);
    const stargazersListFiltered = list.filter(el => el.starred_at && el.starred_at >= opts.since && el.starred_at <= opts.until);

    let result = { count: stargazersListFiltered.length };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(list, opts, timeRange);
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetStargazers in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Issue Comments
 *
 * @function GetIssueComments
 * @param {object} opts
 * @returns {object} returns object containing count for Issue comments
 * @author dev-team
 */
const GetIssueComments = async opts => {
  try {
    let issueCommentsList = [];
    let issuesList = [];
    let count = 0;
    const DbIssuesData = await issuesModel.GetIssuesFromDB(opts);
    const DbCommentsData = await commentsModel.GetCommentsFromDB(opts);
    let result = {};
    if (opts.repoName) {
      if (DbIssuesData && DbCommentsData) {
        issueCommentsList = DbCommentsData.list;
        issuesList = DbIssuesData.list;
      }
      const openIssues = issuesList.filter(issue => issue.date && issue.date >= opts.since && issue.date <= opts.until && issue.state === 'open');
      /* eslint-disable no-restricted-syntax */
      // eslint-disable-next-line no-unused-vars
      for (const issue of openIssues) {
        let openIssueComments = issueCommentsList.filter(comment => comment.number === issue.number);
        openIssueComments = openIssueComments.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (openIssueComments.length) {
          if (issue.author === openIssueComments[0].author) count += 1;
        } else {
          count += 1;
        }
      }
      result = {
        count
      };
    } else {
      const PRComments = DbCommentsData.list.filter(comments => {
        return comments.type === 'pulls';
      });
      const PRIssues = DbCommentsData.list.filter(comments => {
        return comments.type === 'issues';
      });
      result = {
        total: PRComments.length + PRIssues.length,
        pullRequest: PRComments.length,
        issues: PRIssues.length
      };
      if (opts.customFlag.toUpperCase() === 'FALSE') {
        const timeRange = await Utility.GetSelectedOption(opts);
        const countDiff = await Utility.StatisticalDataComparison(DbCommentsData.list, opts, timeRange);
        result = { ...result, statisticalData: countDiff };
      }
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetIssueComments in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Issue Lists
 *
 * @function GetIssueList
 * @param {object} opts
 * @returns {object} returns Issue list
 * @author dev-team
 */
const GetIssueList = async opts => {
  try {
    const { list } = await issuesModel.GetIssuesFromDB(opts);
    return list;
  } catch (exc) {
    Logger.log('error', `Error in GetIssueList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Issues
 *
 * @function GetIssues
 * @param {object} opts
 * @returns {object} returns Issue status
 * @author dev-team
 */
const GetIssues = async opts => {
  try {
    const issuesList = await GetIssueList(opts);
    const issuesListFiltered = issuesList.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    const open = issuesListFiltered.filter(issue => issue.state === 'open');
    const closed = issuesListFiltered.filter(issue => issue.state === 'closed');
    const avgTimeToClose = await Utility.GetAverageTimeTakenToClose(issuesListFiltered, opts.since, opts.until);
    let result = {
      total: issuesListFiltered.length,
      open: open.length,
      closed: closed.length,
      avgTimeToCloseIssue: avgTimeToClose
    };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(issuesList, opts, timeRange);
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetIssues in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Commit list
 *
 * @function GetCommitList
 * @param {object} opts
 * @returns {object} returns Commit list
 * @author dev-team
 */
const GetCommitList = async opts => {
  try {
    const { list } = await commitsModel.GetCommitsFromDB(opts);
    return list;
  } catch (exc) {
    Logger.log('error', `Error in GetCommitList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Commits
 *
 * @function GetCommits
 * @param {object} opts
 * @returns {object} returns commits data
 * @author dev-team
 */
const GetCommits = async opts => {
  try {
    const domainName = opts?.email.split('@')[1];
    const commitsList = await GetCommitList(opts);
    const commitsListFiltered = commitsList.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    const internalUsers = [];
    const externalUsers = [];
    commitsListFiltered.forEach(commit => {
      if (commit.email.includes('github.com') || commit.email.includes(domainName)) {
        internalUsers.push(commit.name);
      } else {
        externalUsers.push(commit.name);
      }
    });
    const internal = internalUsers.filter((val, index) => internalUsers.indexOf(val) === index);
    const external = externalUsers.filter((val, index) => externalUsers.indexOf(val) === index);
    let avgCont = 0;
    if (commitsListFiltered.length) avgCont = Math.round(commitsListFiltered.length / (internal.length + external.length));
    const result = {
      commits: {
        count: commitsListFiltered.length
      },
      contributors: {
        total: internal.length + external.length,
        internal: internal.length,
        external: external.length
      },
      avgContributions: avgCont
    };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const [countDiffCommits, countDiffContributors] = await Promise.all([
        Utility.StatisticalDataComparison(commitsList, opts, timeRange),
        Utility.StatisticalDataComparison(commitsList, opts, timeRange, 'getcontributors')
      ]);
      result.commits.statisticalData = countDiffCommits;
      result.contributors.statisticalData = countDiffContributors;
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetCommits in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Clones
 *
 * @function GetClones
 * @param {object} opts
 * @returns {object} returns clones data
 * @author dev-team
 */
const GetClones = async opts => {
  try {
    let count = 0;
    const { list } = await clonesModel.GetClonesFromDB(opts);
    const clonesListFiltered = list.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    clonesListFiltered.forEach(clone => {
      count += clone.count;
    });

    let result = { count };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(list, opts, timeRange, 'getclones');
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetClones in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Releases
 *
 * @function GetReleases
 * @param {object} opts
 * @returns {object} returns releases' data
 * @author dev-team
 */
const GetReleases = async opts => {
  try {
    let { list } = await releaseModel.GetReleaseFromDB(opts);
    list = await Utility.CountDiffCalculation(list);
    const count = await Utility.CalculateCountFromObject(list, opts.since, opts.until);

    let result = { count };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(list, opts, timeRange, 'getreleases');
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetReleases in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Pull request list
 *
 * @function GetPullRequestList
 * @param {object} opts
 * @returns {array} returns PR list
 * @author dev-team
 */
const GetPullRequestList = async opts => {
  try {
    const { list } = await pullrequestModel.GetPullsFromDB(opts);
    return list;
  } catch (exc) {
    Logger.log('error', `Error in GetPullRequestList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Pull Request
 *
 * @function GetPullRequests
 * @param {object} opts
 * @returns {object} returns Pull Requests
 * @author dev-team
 */
const GetPullRequests = async opts => {
  try {
    const prList = await GetPullRequestList(opts);
    const result = await cards.listPRresponse(prList, opts);
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetPullRequests in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Views
 *
 * @function GetViewDetails
 * @param {object} opts
 * @returns {object} returns views (visits and visitors) data
 * @author dev-team
 */
const GetViewDetails = async opts => {
  try {
    let unique = 0;
    let count = 0;
    const createdAt = [];
    const { list } = await viewsModel.GetViewsFromDB(opts);
    list.forEach(view => {
      createdAt.push(view.date);
    });
    const viewListFiltered = list.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    viewListFiltered.forEach(view => {
      count += view.count;
      unique += view.uniques;
    });

    const result = { visits: count, visitors: unique };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const [visitorsDiff, visitsDiff] = await Promise.all([
        Utility.StatisticalDataComparison(list, opts, timeRange, 'getVisitors'),
        Utility.StatisticalDataComparison(list, opts, timeRange, 'getVisits')
      ]);
      result.statisticalData = { visitorsDiff, visitsDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetViewDetails in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Actions
 *
 * @function GetActions
 * @param {object} opts
 * @returns {object} returns Actions data
 * @author dev-team
 */
const GetActions = async opts => {
  try {
    const { list } = await actionsModel.GetActionsFromDB(opts);
    const eventListFiltered = list.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    let result = { count: eventListFiltered.length };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(list, opts, timeRange);
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetActions in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Forks
 *
 * @function GetForks
 * @param {object} opts
 * @returns {object} returns Forks data
 * @author dev-team
 */
const GetForks = async opts => {
  try {
    const { list } = await forksModel.GetForksFromDB(opts);
    const forksListFiltered = list.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    let count = forksListFiltered.length;
    forksListFiltered.forEach(fork => {
      if (fork.count > 0) {
        count += fork.count;
      }
    });

    let result = { count };
    if (opts.customFlag.toUpperCase() === 'FALSE') {
      const timeRange = await Utility.GetSelectedOption(opts);
      const countDiff = await Utility.StatisticalDataComparison(list, opts, timeRange, 'getforks');
      result = { ...result, statisticalData: countDiff };
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetForks in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Active Users
 *
 * @function GetActiveUsers
 * @param {object} opts
 * @returns {array} returns list of active users
 * @author dev-team
 */
const GetActiveUsers = async opts => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [commitsList, PRList, issuesList] = await Promise.all([GetCommitList(opts), GetPullRequestList(opts), GetIssueList(opts)]);
    const issuesListFiltered = issuesList.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    const commitsListFiltered = commitsList.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    const PullReqList = PRList.filter(el => el.created_at && el.created_at >= opts.since && el.created_at <= opts.until);
    const authorNames = [];
    commitsListFiltered.forEach(com => {
      if (!authorNames.includes(com.author)) {
        authorNames.push(com.author);
      }
    });

    const activeUsers = [];
    authorNames.forEach(author => {
      let avatar_url = '';
      const particularAuthorIssueslist = issuesListFiltered.filter(el => el.author === author);
      const openIssues = particularAuthorIssueslist.filter(issue => issue.state === 'open');
      const comList = commitsListFiltered.filter(el => el.author === author);
      if (comList.length) avatar_url = comList[0].avatar;
      const result = {
        name: author,
        avatar_url,
        commits: comList.length,
        pulls: PullReqList.filter(el => el.author === author).length,
        openIssues: openIssues.length,
        closedIssues: particularAuthorIssueslist.length - openIssues.length
      };
      activeUsers.push(result);
    });

    activeUsers.sort((a, b) => {
      return b.commits - a.commits || b.pulls - a.pulls || b.openIssues - a.openIssues || b.closedIssues - a.closedIssues || a.name.localeCompare(b.name);
    });
    return activeUsers;
  } catch (exc) {
    Logger.log('error', `Error in GetActiveUsers in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle License
 *
 * @function GetLicense
 * @param {object} opts
 * @returns {array} returns list of license
 * @author dev-team
 */
const GetLicense = async opts => {
  try {
    const { license } = await licenseModel.GetLicenseFromDB(opts);
    return license;
  } catch (exc) {
    Logger.log('error', `Error in GetLicense in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Tags
 *
 * @function GetTags
 * @param {object} opts
 * @returns {array} returns list of tags
 * @author dev-team
 */
const GetTags = async opts => {
  try {
    const { list } = await tagsModel.GetTagsFromDB(opts);
    const tagList = list.filter(el => el.date && el.date >= opts.since && el.date <= opts.until);
    return tagList;
  } catch (exc) {
    Logger.log('error', `Error in GetTags in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Languages
 *
 * @function GetLanguages
 * @param {object} opts
 * @returns {array} returns list of langauges
 * @author dev-team
 */
const GetLanguages = async opts => {
  try {
    const { language } = await languageModel.GetLanguageFromDB(opts);
    return language;
  } catch (exc) {
    Logger.log('error', `Error in GetLanguages in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Repository tree
 *
 * @function GetRepoTree
 * @param {object} opts
 * @returns {array} returns repository tree
 * @author dev-team
 */
const GetRepoTree = async opts => {
  try {
    const response = await repoTreeModel.GetRepoTreeFromDB(opts);
    return response ? response.tree : [];
  } catch (exc) {
    Logger.log('error', `Error in GetRepoTree in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

module.exports = {
  GetWatchers,
  GetStargazers,
  GetIssues,
  GetCommits,
  GetClones,
  GetReleases,
  GetPullRequests,
  GetViewDetails,
  GetActions,
  GetForks,
  GetIssueComments,
  GetActiveUsers,
  GetLicense,
  GetTags,
  GetLanguages,
  GetRepoTree
};
