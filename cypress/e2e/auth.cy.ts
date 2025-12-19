describe('Authentication', () => {
    it('should register a new user', () => {
        cy.visit('http://localhost:3000/signup');
        const username = `testuser`

        cy.get('input[type="text"]').type(username)
        cy.get('input[type="password"]').type('test123')
        cy.contains('button', 'Sign Up').click()
        cy.contains('Go to Login').click()

        cy.url().should('include', '/')
    })

    it('should login existing user, then post an review, then delete the account', () => {
        cy.visit('http://localhost:3000')

        cy.get('input[type="text"]').type('testuser')
        cy.get('input[type="password"]').type('test123')
        cy.contains('button', 'Log In').click()

        cy.url().should('include', '/Movies')

        cy.contains('Inception').click()
        cy.contains('button', 'Rate & Review This Movie').click()

        cy.get('[data-rating="4"]').click()
        cy.get('textarea[name="review"]').type('Great movie!')
        cy.contains('button', 'Submit Rating').click()

        
        cy.visit('http://localhost:3000/Movies')

        cy.contains('Following').click()
        cy.url().should('include', '/following')
        
        cy.contains('button', 'Follow Someone').click()
        cy.get('input[data-testid="search-users"]').type('maccoe')
        cy.contains('button', 'Search').click()

        cy.contains('button', 'Follow').click()

        cy.contains('Browse Movies').click()
        cy.url().should('include', '/Movies')

        cy.contains('My Profile').click()
        cy.on('window:confirm', () => true);

        cy.contains('button', 'Delete Account').click()

        cy.url().should('include', '/')

    })

    
})