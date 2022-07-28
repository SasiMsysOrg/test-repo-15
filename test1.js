// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('chai');
const chai = require('chai');
// eslint-disable-next-line import/no-extraneous-dependencies
const chaiHttp = require('chai-http');
const { TokenExpiredError } = require('jsonwebtoken');

chai.use(chaiHttp);
chai.should();
// const server = require('../server');
const server = 'http://172.30.44.22:9090'

let token = '';
// let repoName = repoName;
let expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRoYW1pemgtbXN5cyIsImVtYWlsIjoidGRoYW5kYXBhbmlAbXN5c3RlY2hub2xvZ2llcy5jb20iLCJvcmdJZCI6MjQ5MzI0MSwib3JnTmFtZSI6Ik1zeXNUZWNobm9sb2dpZXNsbGMiLCJzdGF0dXMiOiJBcHByb3ZlZCIsInJvbGUiOiJBZG1pbiIsImV4cGlyYXRpb25UaW1lIjoiMjAyMi0wNC0xM1QxNDo0Mjo0NloiLCJpYXQiOjE2NDk4MzIxNjZ9.nPDGuOLHVJh9HYinVO2XEELyLKn-y5Rv28vIFhrJ11c';

describe('Getting Token and status check', () => {
  before(function (done) {
    chai.request(server)
      .post('/rest/users/signin')
      .send({ username: 'thamizh-msys', password: 'NewPass@123' })
      .end(function (err, res) {
        token = res.body.token; // Or something
        console.log(token);
        done();
      });
  });
  it('it should get status', (done) => {
    chai.request(server)
      .get('/rest/status')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status('200');
        done();
      });
  });
});

describe('Get org name for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Get org name for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // data.should.be.a('array');
        done();
      });
  });
  it('Get org name for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Get org details for admin routes & Get repo name', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgDetails')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Get org details for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgDetails')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // data.should.be.a('array');
        done();
      });
  });
  it('Get org details for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgDetails')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Get repos for admin routes & Get repo name', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getRepos')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it(' Get repos for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getRepos')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // data.should.be.a('array');
        done();
      });
  });
  it('Get repos for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getRepos')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Get repo details with % for admin routes & Get repo name', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getRepoDetails')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Get repo details with % for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getRepoDetails')
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('Get repo details with % for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getRepoDetails')
      .query({ org_name: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Get members for admin routes & Get repo name', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getMembers')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Get members for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getMembers')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // data.should.be.a('array');
        done();
      });
  });
  it('Get members for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getMembers')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Get org name for admin routes & Get repo name', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Get org name for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // data.should.be.a('array');
        done();
      });
  });
  it('Get org name for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Get org name for admin routes & Get repo name', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Get org name for admin routes - No data ', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // data.should.be.a('array');
        done();
      });
  });
  it('Get org name for admin routes with Data', done => {
    chai
      .request(server)
      .get('/rest/admin/getOrgName')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', token)
      .then(res => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('POST -  Invite Organization', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .post('/rest/admin/inviteOrg')
      .send({ 
        org_name: 'TestOrg',
        org_full_name:  "Test Msys Technlogies",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Invite organisation - No data ', done => {
    chai.request(server)
      .post('/rest/admin/inviteOrg')
      .send({ 
        org_name: 'TestOrg',
        org_full_name:  "Test Msys Technlogies",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Invite organisation - Data ', done => {
    chai.request(server)
      .post('/rest/admin/inviteOrg')
      .send({ 
        org_name: 'TestOrg',
        org_full_name:  "Test Msys Technlogies",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('POST -  add member', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .get('/rest/admin/addMember')
      .query({ orgName: 'MsysTechnologiesllc' })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Add Member - No data ', done => {
    chai.request(server)
      .post('/rest/admin/addMember')
      .send({
        "memberName": "thamizh-msys",
        "memberId": 123,
        "avatarUrl": "",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          {
            repo_id: 123,
            repo_name: "gitboard-fe"
          }
        ]
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Add Member - Data ', done => {
    chai.request(server)
      .post('/rest/admin/addMember')
      .send({
        "memberName": "thamizh-msys",
        "memberId": 123,
        "avatarUrl": "",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          {
            repo_id: 123,
            repo_name: "gitboard-fe"
          }
        ]
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Update Auto Onboarding for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/updateAutoOnboarding')
      .send( { enableAutoOnboarding: true })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Update Auto Onboarding for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/updateAutoOnboarding')
      .send( { enableAutoOnboarding: true })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Update Auto Onboarding for admin routes - Data ', done => {
    chai.request(server)
      .put ('/rest/admin/updateAutoOnboarding')
      .send( { enableAutoOnboarding: true })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Update pause onboarding for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/pauseOnboarding')
      .send({ 
        org_name: 'TestOrg',
        org_full_name:  "Test Msys Technlogies",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Update pause onboarding for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/pauseOnboarding')
      .send({ 
        org_name: 'TestOrg',
        org_full_name:  "Test Msys Technlogies",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Update pause onboarding for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/pauseOnboarding')
      .send({ 
        org_name: 'TestOrg',
        org_full_name:  "Test Msys Technlogies",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Update repo anabled status for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/updateRepo')
      .send({
        repo_id: 123456,
        repo_enabled: false
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Update repo anabled status for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/updateRepo')
      .send({
        repo_id: 123456,
        repo_enabled: false
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Update repo anabled status for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/updateRepo')
      .send({
        repo_id: 123456,
        repo_enabled: false
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
  it('Array - Update repo anabled status for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/updateRepo')
      .send({
        "repo_id": [379154389, 379195792],
        "repo_enabled": true
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Array - Update repo anabled status for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/updateRepo')
      .send({
        "repo_id": [379154389, 379195792],
        "repo_enabled": true
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Delete member role for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/deleteRepo')
      .send({
        "repo_id": 18263735
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Delete member role for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/deleteRepo')
      .send({
        "repo_id": 18263735
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Delete member role for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/deleteRepo')
      .send({
        "repo_id": 18263735
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT - Restart repo for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/restartRepo')
      .send( { repositories: repos })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Restart repo for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/restartRepo')
      .send( { repositories: repos })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Restart repo for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/restartRepo')
      .send( { repositories: repos })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Update Maintainer/member for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/updateMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ],
        "role": "Maintainer"
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Update Maintainer for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/updateMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ],
        "role": "Maintainer"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Update Maintainer for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/updateMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ],
        "role": "Maintainer"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
  it('Update member for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/updateMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ],
        "role": "Member"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Update member for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/updateMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ],
        "role": "Member"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Approve member for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/approveMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ], 
        role: "Admin"
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Approve member for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/approveMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ], 
        role: "Admin"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Approve member for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/approveMember')
      .send({
        "username": "thamizh-msys",
        "email": "tdhandapani@msystechnologies.com",
        "repositories": [
          "123456",
          "124578",
          "235689"
        ], 
        role: "Admin"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Reject member for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/rejectMember')
      .send({ 
        "username": "sathish-msys",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Reject member for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/rejectMember')
      .send({ 
        "username": "sathish-msys",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Reject member for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/rejectMember')
      .send({ 
        "username": "sathish-msys",
        email: "rbalachandar@msystechnolgies.com"
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('PUT -  Update member role for admin routes', () => {
  it('Expired or Invalid token', done => {
    chai
      .request(server)
      .put('/rest/admin/updateRole')
      .send({
        username: thamizh-msys,
        role: Admin
      })
      .set('token', expiredToken)
      .then(res => {
        let data = res.body;
        res.should.have.status(404);
        res.body.should.be.a('object');
        data.should.have.property('message').and.to.equal('Not found');
        done();
      });
  });
  it('Update member role for admin routes - No data ', done => {
    chai.request(server)
      .put('/rest/admin/updateRole')
      .send({
        username: thamizh-msys,
        role: Admin
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        done();
      });
  });
  it('Update member role for admin routes - Data ', done => {
    chai.request(server)
      .put('/rest/admin/updateRole')
      .send({
        username: thamizh-msys,
        role: Admin
      })
      .set('token', token)
      .end(function (err, res) {
        let data = res.body; // Or something
        res.should.have.status('200');
        res.body.should.be.a('object');
        done();
      });
  });
});
