describe('Tests with backend', () => {

  beforeEach('login to the app', () => {

    cy.loginToApplication()

  })

  it('verify correct request and response', () => {

    cy.server()
    cy.route('POST', '**/articles').as('postArticles')

    cy.contains(' New Article').click()
    cy.get('[formcontrolname="title"]').type('Ukraine QA\'s are the best)')
    cy.get('[formcontrolname="description"]').type('Because we are best of the best')
    cy.get('[formcontrolname="body"').type('Ukraine is the powerful country')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.status).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('Ukraine is the powerful country')
      expect(xhr.response.body.article.description).to.equal('Because we are best of the best')
    })
  })
})
