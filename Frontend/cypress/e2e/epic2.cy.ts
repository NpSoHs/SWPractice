import { request } from "http"

describe('US2-1 User should make a reservation with valid time', () => {
  beforeEach(() => {
    // Visit the login page and login
    cy.visit('/login');
    cy.get('input[name="email"]').type('fortesting@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    // Visit one space page
    cy.visit('/space/662f51b9519d18088daacf91');
    cy.wait(5000)
  });

  it('TC18 No date and time provided', () => {
    cy.contains('button', 'Reserve').click();
    cy.contains('Please provide date').should('be.visible');
  });

  it('TC19 Provide date but no time provided', () => {
    cy.get('[data-testid="spaceDatePicker"]').type("2024-08-29").type('{enter}');
    cy.contains('button', 'Reserve').click();
    cy.contains('Please provide time').should('be.visible');
  });

  it('TC20 Provide date and time which endDate is less than startDate', () => {
    cy.get('[data-testid="spaceDatePicker"]').type("2024-08-29").type('{enter}');
    cy.wait(2000);
    cy.get('[data-testid="spaceEndTime"]').type("09:00").type('{enter}');
    cy.get('[data-testid="spaceStartTime"]').type("10:00").type('{enter}');
    //cy.get('[data-testid="spaceEndTime"]').type("9:00").type('{enter}');
    cy.wait(2000);
    cy.contains('button', 'Reserve').click();
    cy.contains('Please provide time').should('be.visible');
  });

  it('TC21 Provide date and time which endDate is equal to startDate', () => {
    cy.get('[data-testid="spaceDatePicker"]').type("2024-08-29").type('{enter}');
    cy.wait(2000);
    cy.get('[data-testid="spaceStartTime"]').type("10:00").type('{enter}');
    cy.get('[data-testid="spaceEndTime"]').type("10:00").type('{enter}');
    cy.wait(2000);
    cy.contains('button', 'Reserve').click();
    cy.contains('Please provide time').should('be.visible');
  });

  it('TC22 Provide date and time which endDate is greater than startDate', () => {
    cy.get('[data-testid="spaceDatePicker"]').type("2024-08-29").type('{enter}');
    cy.wait(2000);
    cy.get('[data-testid="spaceStartTime"]').type("11:00").type('{enter}');
    cy.get('[data-testid="spaceEndTime"]').type("12:00").type('{enter}');
    cy.wait(2000);
    cy.contains('button', 'Reserve').click();
    cy.contains('Create successfully').should('be.visible');
  });
})

describe('US2-2 User can view amount of available seats of selected time', () => {
  beforeEach(() => {
    // Visit the login page and login
    cy.visit('/login');
    cy.get('input[name="email"]').type('fortesting@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    // Visit one space page
    cy.visit('/space/662f51b9519d18088daacf91');
    cy.wait(3000)
  });

  it('TC23 logged in user can see the available time', () => {
    cy.get('[data-testid="spaceStartTime"]').should('exist');
    cy.get('[data-testid="spaceStartTime"]').should('exist');
    cy.get('[data-testid="availableSeat"]').should('not.exist');
  })
  it('TC24 logged in user with time provided can see the amount of available seat', () => {
    cy.get('[data-testid="spaceDatePicker"]').type("2024-09-29").type('{enter}');
    cy.get('[data-testid="spaceStartTime"]').type("11:00").type('{enter}');
    cy.get('[data-testid="spaceEndTime"]').type("12:00").type('{enter}');
    cy.wait(3000);
    cy.get('[data-testid="availableSeat"]').should('exist');
  })
})

describe('US2-3 User should edit a reservation with valid time', () => {
  beforeEach(() => {
    // Visit the login page and login
    // cy.visit('/space/6621e0dd0ca3b59b54586983');
    cy.visit('/login');
    cy.get('input[name="email"]').type('fortesting@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.visit('/booking/manage');
    cy.wait(1000)
    cy.get('[data-testid="reservationtest"]').last().contains('Edit').click();
    cy.wait(8000)
  });

  it('TC25 everything is null', () => {
    cy.get(".ant-picker-clear").eq(0).click();
    cy.get(".ant-picker-clear").eq(1).click();
    cy.get(".ant-picker-clear").click();
    cy.wait(2000)
    cy.contains('button', 'Save Change').click();
    cy.contains('Please provide date').should('be.visible');
  });


  it('TC26 start and end time is null', () => {
    cy.get('[data-testid="spaceDatePicker"]').clear().type("2024-09-29").type('{enter}');
    cy.get(".ant-picker-clear").eq(1).click();
    cy.get(".ant-picker-clear").eq(1).click();
    cy.wait(1000)
    cy.contains('button', 'Save Change').click();
    cy.wait(2000)
    cy.contains('Please provide time').should('be.visible');
  });

it('TC27 start time is after end time', () => {
  cy.get('[data-testid="spaceEndTime"] input').invoke('val').then(value => {
      let initialEndTime = value;
      console.log(initialEndTime);
      cy.get('[data-testid="spaceDatePicker"]').clear().type("2024-09-29").type('{enter}');
      cy.get('[data-testid="spaceStartTime"]').clear().type("13:00").type('{enter}');
      cy.get('[data-testid="spaceEndTime"]').clear().type("12:00").type('{enter}');
      cy.contains("Date").click();
      cy.get('[data-testid="spaceEndTime"] input').should('have.value', initialEndTime);
      
  });
});

  it('TC28 start time is same end time', () => {
    cy.get('[data-testid="spaceEndTime"] input').invoke('val').then(value => {
      let initialEndTime = value;
      console.log(initialEndTime);
      cy.get('[data-testid="spaceDatePicker"]').clear().type("2024-09-29").type('{enter}');
      cy.get('[data-testid="spaceStartTime"]').clear().type("10:00").type('{enter}');
      cy.get('[data-testid="spaceEndTime"]').clear().type("10:00").type('{enter}');
      cy.contains("Date").click();
      cy.get('[data-testid="spaceEndTime"] input').should('have.value', initialEndTime);
    })
});
  
  it('TC29 Provide valid time', () => {
    cy.get('[data-testid="spaceDatePicker"]').clear().type("2024-09-29").type('{enter}');
    cy.get('[data-testid="spaceStartTime"]').clear().type("12:00").type('{enter}');
    cy.get('[data-testid="spaceEndTime"]').clear().type("13:00").type('{enter}');
    cy.wait(2000)
    cy.contains('button', 'Save Change').click();
    cy.wait(10000)
    cy.contains('Update successfully').should('be.visible');
    cy.wait(3000);
    cy.visit('/booking/manage');
    cy.wait(1000)
    cy.get('[data-testid="reservationtest"]').last().contains('Delete').click();
    cy.wait(8000)
  });

  it('TC30 does not change anything', () => {
    cy.contains('button', 'Save Change').click();
    cy.contains('No changes have been made.').should('be.visible');
  });
})

describe('US2-4 User should be able to view reservation history', () => {
  it('TC31 User who has already edited at least 1 reservation can view history', () => {
    // Visit the login page and login
    cy.visit('/login');
    cy.get('input[name="email"]').type('fortesting@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    // Visit one space page
    cy.visit('/booking/manage');
    cy.wait(3000)

    cy.get('a[href="/booking/history"]').should('exist');
    cy.get('a[href="/booking/history"]').click();
    cy.wait(3000);
    cy.get('[data-testid="reservationLog"]').should('be.visible');
  })

  it('TC32 User who have not edited any reervation yet', () => {
    // Visit the login page and login
    cy.visit('/login');
    cy.get('input[name="email"]').type('fornohistorytesting@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    // Visit one space page
    cy.visit('/booking/manage');
    cy.wait(3000)

    cy.get('a[href="/booking/history"]').should('exist');
    cy.get('a[href="/booking/history"]').click();
    cy.wait(3000);
    cy.contains('h2', "You haven't edit any reservation yet.").should('be.visible');
  })
})