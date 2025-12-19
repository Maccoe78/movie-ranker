describe('Authentication', () => {
    it('should register a new user', () => {
        cy.visit('http://localhost:3000/signup');
        const username = `testuser`

        cy.get('input[type="text"]').type(username)
        cy.get('input[type="password"]').type('test123')
        cy.contains('button', 'Sign Up').click()
    })

    it('should login existing user', () => {
        cy.visit('http://localhost:3000')

        cy.get('input[type="text"]').type('testuser')
        cy.get('input[type="password"]').type('test123')
        cy.contains('button', 'Log In').click()

        cy.url().should('include', '/Movies')

        cy.visit('http://localhost:3000/profile')
        cy.on('window:confirm', () => true);

        cy.contains('button', 'Delete Account').click()

        cy.url().should('include', '/')

    })

    
})