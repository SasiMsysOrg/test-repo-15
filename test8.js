/**
 * Controller file to handle all the business logics
 */
const moment = require('moment');
const path = require('path');
const mongoose = require('mongoose');
const { Logger, Utility } = require('../helpers/index');
const { usersModel, organizationsModel, notificationsModel } = require('../models/index');
const { users } = require('../api/index');
const {
  objectConstants: { roles, authenticationMessage, userStatus }
} = require('../constants/index');

/**
 * Handle User login
 *
 * @function UserLogin
 * @param {object} opts
 * @returns {object} - returns user data as response
 * @author dev-team
 */
const UserLogin = async opts => {
  try {
    // check if org enabled
    const userData = await usersModel.GetUserData(opts);
    if (Object.keys(userData).length && userData.role !== roles.SUPER_ADMIN) {
      const { admin_approved: enabled } = await organizationsModel.GetOrg(userData.org_id);
      if (!enabled) return { status: 'error', statusCode: 404, message: 'Your organization is currently disabled. Please contact administrator.' };
    }

    return await usersModel.UserLogin(opts, userData);
  } catch (exc) {
    Logger.log('error', `Error in UserLogin in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

const ResetPassword = async opts => {
  try {
    const { res } = await usersModel.ResetPassword(opts);
    return res;
  } catch (exc) {
    Logger.log('error', `Error in UserLogin in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle User logout
 *
 * @function UserLogout
 * @param {string} token
 * @returns {object} - returns users logout response
 * @author dev-team
 */
const UserLogout = async token => {
  try {
    const decodedToken = await Utility.DecryptToken(token);
    if (!decodedToken) return Utility.InvalidToken();
    return await usersModel.UserLogout(decodedToken);
  } catch (exc) {
    Logger.log('error', `Error in UserLogout in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle User signup
 *
 * @function UserSignup
 * @param {object} opts
 * @returns {object} - returns users signup response
 * @author dev-team
 */
const UserSignup = async opts => {
  try {
    const actions = { getOrg: organizationsModel.GetOrg };
    const { res, mode, param } = await usersModel.UserSignup(opts, actions);
    if (res && res.statusCode === 200) {
      const params = { orgId: param.orgId, username: param.username, email: param.email, status: res.userStatus };
      if (mode === 'save') await notificationsModel.AddNotification(params);
      else await notificationsModel.UpdateNotification(params);
    }
    return res;
  } catch (exc) {
    Logger.log('error', `Error in UserSignup in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Oauth users
 *
 * @function ProcessOauthUsers
 * @param {object} opts
 * @returns {object} - returns Oauth users login response
 * @author dev-team
 */
const ProcessOauthUsers = async opts => {
  try {
    const { username, email, avatarUrl } = opts;
    const user = await usersModel.GetUserData(opts);
    const actions = { getOrg: organizationsModel.GetOrg };

    // check if user exist
    if (!Object.keys(user).length) {
      const org = await organizationsModel.GetOrgDetailsWithUser({ username, email });
      if (!org) return { status: 'error', statusCode: 404, message: `${username}${authenticationMessage.NOT_REGISTERED}` };
      const res = await usersModel.SaveOauthUser({ orgId: org.org_id, orgName: org.org_name, username, email, avatarUrl }, actions);
      if (res && res.statusCode === 200) {
        const params = { orgId: org.org_id, username, email, status: userStatus.APPROVED, role: roles.ADMIN };
        await notificationsModel.AddNotification(params);
      }
      return res;
    }
    return await usersModel.UpdateOauthUser({ ...user, avatarUrl }, actions);
  } catch (exc) {
    Logger.log('error', `Error in ProcessOauthUsers in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get Oauth token
 *
 * @function GetOauthToken
 * @param {string} code
 * @returns {object} - returns users data with token as success response or error response
 * @author dev-team
 */
const GetOauthToken = async code => {
  try {
    let user = {};
    let userMail = '';
    const token = await users.GetAccessToken(code);
    if (token) {
      const { login, email, avatar_url: avatarUrl } = await users.GetUserDetails(token);
      if (login) {
        user = { username: login, email, avatarUrl, token };
        if (!user.email) {
          const [userMailInfo] = await users.GetUserMail(token);
          if (userMailInfo) {
            userMail = userMailInfo.email;
          }
          user.email = userMail;
        }
      }
      return await ProcessOauthUsers(user);
    }
    return { status: 'error', statusCode: 403, message: 'Unable to get token' };
  } catch (exc) {
    Logger.log('error', `Error in GetOauthToken in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Saves profile image
 *
 * @function SaveImage
 * @param {object} opts
 * @param {string} token
 * @returns {object} - returns saved image data
 * @author dev-team
 */
const SaveImage = async (opts, token) => {
  try {
    const decodedToken = await Utility.DecryptToken(token);
    if (!decodedToken) return Utility.InvalidToken();
    return await usersModel.SaveImageValue(decodedToken, opts);
  } catch (exc) {
    Logger.log('error', `Error in SaveImage in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get Organization details
 *
 * @function GetOrgDetails
 * @param {string} token
 * @returns {object} - returns organization data
 * @author dev-team
 */
const GetOrgDetails = async id => {
  try {
    const org = await organizationsModel.GetOrgDetailsWithObjectId(id);
    if (!org) {
      const user = await usersModel.GetUser({ _id: mongoose.Types.ObjectId(id) });
      if (!user) return { status: 'error', statusCode: 404, message: 'Organization or User not found.' };

      const { username, full_name: fullName, email } = user;
      return { status: 'success', statusCode: 200, username, fullName, email };
    }

    const { installation_id: installationId, org_id: orgId, org_name: orgName, username, email, org_full_name: orgFullName, description } = org;
    return { status: 'success', statusCode: 200, installationId, orgId, orgName, role: roles.ADMIN, username, email, orgFullName, description };
  } catch (exc) {
    Logger.log('error', `Error in SaveImage in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    return { status: 'error', statusCode: 409, message: 'error in getting org details' };
  }
};

/**
 * Sets last login time
 *
 * @function SetLastLogin
 * @param {string} username
 * @author dev-team
 */
const SetLastLogin = async ({ username }) => {
  try {
    const lastLoginTime = moment(new Date())
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
    await usersModel.UpdateLastLoginTime({ username, lastLoginTime });
  } catch (exc) {
    Logger.log('error', `Error in SetLastLogin in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

const CreateDevopsUser = async () => {
  try {
    const lastLoginTime = moment(new Date())
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
    const devopsUser = { username: 'Devops', role: 'Devops', email: 'devops@msystechnologies.com', last_login_time: lastLoginTime };
    const res = await usersModel.CreateDevopsUser(devopsUser);
    return res || { status: 'error', statusCode: 403, message: 'Error in creating devops user.' };
  } catch (exc) {
    Logger.log('error', `Error in CreateDevopsUser in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

const GetPwdDetails = async pwdDetails => {
  try {
    Logger.log('info', 'Get password details to Forgot Password');
    const passwordDetails = await usersModel.getPwdDetails(pwdDetails);
    let filterPwdData = {};
    if (passwordDetails) {
      filterPwdData = {
        email: passwordDetails.email,
        message: 'Temporary password sent to registered Mail',
        status: 200
      };
    } else {
      filterPwdData = { message: 'Mail ID Not found', statusCode: 404 };
    }
    return filterPwdData;
  } catch (exc) {
    Logger.log('error', `Error in UpdateUser in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

module.exports = {
  UserLogin,
  UserLogout,
  UserSignup,
  GetOauthToken,
  SaveImage,
  GetOrgDetails,
  SetLastLogin,
  CreateDevopsUser,
  GetPwdDetails,
  ResetPassword
};
