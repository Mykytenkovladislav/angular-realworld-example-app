describe('Tests with backend', () => {

  beforeEach('login to the app', () => {
    cy.intercept({method: 'Get', path: 'tags'}, {fixture: 'tags.json'})
    cy.loginToApplication()

  })

  it('verify correct request and response', () => {

    cy.intercept('POST', '**/articles').as('postArticles')

    cy.contains(' New Article').click()
    cy.get('[formcontrolname="title"]').type('Ukraine QA\'s are the best)')
    cy.get('[formcontrolname="description"]').type('Because we are best of the best')
    cy.get('[formcontrolname="body"').type('Ukraine is the powerful country')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('Ukraine is the powerful country')
      expect(xhr.response.body.article.description).to.equal('Because we are best of the best')
    })
  })

  it.only('intercepting and modifying the requests and response', () => {

    // cy.intercept('POST', '**/articles', (req) => {
    //   req.body.article.description = 'Because we are best of the best22'
    // }).as('postArticles')

    cy.intercept('POST', '**/articles', (req) => {
      req.reply(res => {
        expect(res.body.article.description).to.equal('Because we are best of the best')
        res.body.article.description = 'Because we are best of the best 22'
      })
    }).as('postArticles')


    cy.contains(' New Article').click()
    cy.get('[formcontrolname="title"]').type('Ukraine QA\'s are the best)')
    cy.get('[formcontrolname="description"]').type('Because we are best of the best')
    cy.get('[formcontrolname="body"').type('Ukraine is the powerful country')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('Ukraine is the powerful country')
      expect(xhr.response.body.article.description).to.equal('Because we are best of the best 22')
    })
  })

  it('should gave tags with routing object', () => {
    cy.get('.tag-list').should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'course')
  })

  it('verify global feed likes count', () => {
    cy.intercept('GET', '**/articles/feed*', {"articles": [], "articlesCount": 0})
    cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
    cy.contains('Global Feed').click()

    cy.get('app-article-list button').then(listOfButtons => {
      expect(listOfButtons[0]).to.contain('1')
      expect(listOfButtons[1]).to.contain('5')
    })

    cy.fixture('articles').then(file => {
      const articleLink = file.articles[1].slug
      cy.intercept('POST', '**articles/' + articleLink + '/favorite', file)
    })

    cy.get('app-article-list button')
      .eq(1)
      .click()
      .should('contain', '6')
  })
})
