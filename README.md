# GoodMark

A simple web-tool to preview and edit markdown.

## Project Summary

The purpose for this project is to create an easy to use lightweight Markdown previewing tool. This will allow users to edit and preview Markdown syntax in real-time, aiding those unfamiliar with markdown in proper use, and helping those familiar with markdown get the most out of it. The tool will simply the Markdown working process to ensure that it is accessible for all.

### Project Description

GoodMark is a web-based application designed to simplify the Markdown writing process by transforming plain-text Markdown into rendered HTML in real-time. It will be a good utility for both those who want to experiment with how they might use Markdown and seasoned Markdown users hoping to use a light-weight Markdown tool that renders in real time without needing a full editor installed.

Key features:
1. A real-time preview that dynamically updates as users type Markdown.
2. Syntax highlighting in code snippets.
3. A clean simple User Interface, see [User Interface Design](#user-interface) for more details.
4. Both dark and light mode to suit your preferences.

## Design

There are several stages to designing what this project will look like and how the project will be built. In order to gain a vision of what I am creating I started with the User Interface design. I then went on to design the architecture of the Software and designed how I will go about implementing the Software.

### User Interface

The user interface design was created in Figma. The prototype for this design is available [here](https://www.figma.com/proto/Bkpb34iogKXZpO8ttmP5ef/GoodMark?node-id=1-5&p=f&t=YSk4zt3abM4z9aqy-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A5&show-proto-sidebar=1).

#### Product Design

##### GoodMark Welcome Screen

When the user first opens the website, they should be greeted with a splash screen that will give them a brief overview of what the product is. This is similar to how many applications design their software. We see this significantly in video game design, where you would typically be presented with a game menu before being placed into the game. I felt that this was a good approach for this project as it would not overwhelm newer users with an immediate editing screen, and make them feel that they have a choice before entering the editor. I plan to use a cookie on the user's browser to track if they have visited the site and pressed the "Start Editing" button before, if they have, they will not be presented with the screen again unless they clear their cookies; this will avoid regular users having to continuously press the "Start Editing" button, whilst still giving newer users this choice splash screen. The user will also be able to select whether they wish to use light or dark mode on this screen, this will similarly be saved into a cookie on their browser - dark mode will be the default.

![An image displaying the Welcome Screen for GoodMark. It shows a moon icon for selecting light/dark mode, the text "GoodMark" with "A lightweight, web-based Markdown editor" below it, and a button that says "Start Editing".](assets/readme-images/goodmark-welcome-screen.png)

##### Editor Screen

Once the user selects the "Start Editing" button, or if they have visited the website before and have the cookie stored in their browser, they will be taken to the main Markdown editing screen. This screen will initially have some sample text if they have not edited before, if they have edited before, the last text they wrote will be populated into the textbox, similarly, stored in a cookie. The sample text will feature a heading, some normal text, and a code block to give the user an idea of the different Markdown options available to them. They will also have several options including a combo-box which will allow them to select a font from a pre-defined list, a "Save Markdown" button, allowing them to save a file to their machine containing their Markdown, and a "Load Markdown" button, allowing them to load any Markdown file from their machine into the text box. In the bottom right, there is a "Clear Markdown" button, this will allow the user to quickly clear their Markdown currently present, however, to avoid any accidental data losses it will prompt for confirmation first. Similarly to the welcome screen, they can also select light or dark mode on this screen with the icon in the top left.

###### Dark Mode

![An image showing the Editing Screen for GoodMark in dark mode. It has a large text box with some sample text and a Python code block in, there is a GoodMark title and moon icon to allow the user to switch between light/dark mode at the top of the text box. To the right of the text box there are font selection, "Save Markdown", "Load Markdown", and "Clear Markdown" buttons.](assets/readme-images/goodmark-editing-screen-dark.png)

###### Light Mode

![An image showing the same UI as above, in light mode](assets/readme-images/goodmark-editing-screen-light.png)

##### Colour Scheme

Perhaps the most widely distributed use of Markdown on the internet is on GitHub, as such, I felt that using [GitHub's colour scheme](https://primer.style/foundations/color/base-scales) would be appropriate to allow the user to preview the Markdown in the context that it will likely be distributed, in the form of a README similar to this file. I also feel that GitHub's neutral colour scheme is appropriate for this project as it will not be overstimulating whilst the user is attempting to write their Markdown. Bright flashy colours may distract the user. I also decided that dark mode would be the best as our default colour scheme as it avoids any accidental issues with bright light, for example, if someone's eyes were adjusted to the dark, a bright light will ruin that adjustment, whereas, if someone's eyes are adjusted for the light, a dark screen will minimally change that, if at all.

#### Accessibility

As discussed above, GitHub's colour scheme will have already been tested for accessibility, however, I ran some basic colour blindness simulations, using [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/) to ensure that the UI was appropriate for users with colour blindness, the results of these are available [here](assets/readme-images/colour-blindness-simulations). Other important accessibility considerations that will be required in the implementation are keyboard navigation, to ensure that individuals navigating without a mouse can easily navigate the tool, this will primarily involve ensuring that the "Start Editing" button can be pressed without a mouse, and that the font selection, "Load Markdown" and "Save Markdown", and "Clear Markdown" buttons can be pressed, and that the user can easily return to the editor box. Further important accessibility testing will be to ensure that screen readers are able to correctly read the markdown editing box. Due to the scope and resourcing of this project, languages will not be accounted for, however, this would typically be an important accessibility consideration for a project - in this case, the site will be available in English only. We should also consider individuals devices, as such, responsive design will be important; editing Markdown on a phone is not ideal, but we should allow a user to do this if we wish and scale the page as appropriate, similarly, we need to account for both large and small desktop monitors to ensure that users in all ranges can use the site. There will be no animations on this site, as such, there is no need to consider this, however, we will add a timeout to the dark mode and light mode switcher to avoid any accidental mass-activations which could trigger photosensitivity.

### Software

This is an initial view of the design of the software.

### Architecture

The software will have a frontend, built in React, this will implement a responsive user interface. It will then feature a backend which will be hosted to handle the Markdown-to-HTML rendering, this will allow us to adopt a server-side processing approach. Server-side processing is appropriate as this project is at a small scale, as such, we will not be overly concerned with servers being overwhelmed.

#### Backend Architecture

The backend will be implemented with Node.js, and will feature two main endpoints:
- GET `/render` - this will convert Markdown to HTML
- GET `/fonts` - this will return a list of available fonts to the user

#### Frontend Architecture

The frontend will be implemented with React, and will feature these main components:
- Welcome Page:
  - An icon for light and dark mode
  - A text area for title and description
  - A button for the "Start Editing" button
- Editing Screen:
   - A text area where the user will input the Markdown and it is converted to HTML
   - A header to contain the title and light and dark mode selector
   - A sidebar to contain the font selector, and control buttons
   - Several buttons within the sidebar for controls

### Implementation Approach

In order to ensure the program is robust a Test-Driven Development approach will be taken. This will require that before adding a feature, a test is written to test the feature, and then the feature is implemented to make the test pass. In order to test the frontend we will use Jest's React Testing Library to perform component-level testing to ensure that all components are implemented as designed. In order to ensure that the backend functions correctly, integration unit tests will be written to test each endpoint and its function, any externals will be mocked to ensure that our code is being tested. In order to supplement this implementation approach, we will use GitHub Actions to implement a CI/CD pipeline that ensures that the project builds, that all tests pass, and that the code is linted in the correct format, before a PR can be merged. We will also use the pipeline to deliver any changes from a PR to the live software once merged.

## Planning

In order to create a well-rounded project I want to work using an Agile approach utilising sprints in order to deliver the solution in stages. In order to assist my development of the solution, I will use several tools, the details of these are below.

### Personas and User Stories

The first tool I plan to use in order to guide my development is the use of user stories. Firstly, in a set of high-level stories that outline the main overall requirements of the project, and then with each feature having its own, more specific user story. To further aid this, I have also created three personas who will each have their own goals and struggles, and I have created empathy maps of each of these, when a feature is being developed, I will specify which persona(s) it is for.

#### Personas

##### Developer Dave

Developer Dave is a Junior Developer aged 20.

###### Goals:
1. To be able to quickly view Markdown documentation such as README files.
2. To be able to modify and save reusable Markdown content to share it with his team.
3. To gain a greater understanding of Markdown and how it can be used for writing.

###### Frustrations:
1. He regularly works with tools that have no previews, this means that any syntax mistakes aren't noticed until the Markdown is built.
2. His current employer supported Markdown tool only has light mode available.

###### Empathy Map:

Dave Says:
- "I need to notice errors in my Markdown before it is too late"
- "Light mode strains my eyes, I need a dark mode option"
- "I'd like to learn more about Markdown whilst using it"

Dave Thinks:
- "How can I avoid wasting time fixing Markdown that is already built?"
- "Is there a tool that makes working with Markdown visually enjoyable?"

Dave Feels:
- Frustration that he cannot use a tool with live previews.
- Annoyance that the tools available do not offer dark mode.
- Curiosity about how he can utilise Markdown more.

Dave Does:
- Writes README and documentation files in Markdown.
- Builds Markdown without a live preview, resulting in syntax issues.
- Seeks tools with dark modes available.

##### Writer Wendy

Writer Wendy is an experienced Content Developer aged 35.

###### Goals:
1. To be able to edit documentation in Markdown in a more lightweight environment.
2. To be able to view a live preview as she writes new Markdown or edits existing Markdown.

###### Frustrations:
1. She currently uses an IDE to edit Markdown which she does not use for anything else, she feels this is unnecessarily bloated.
2. Many of the interfaces that she uses are not intuitive and require lots of mouse movement, slowing her workflow down.

###### Empathy Map:

Wendy Says:
- "Why do I need a whole IDE setup when I just want to edit Markdown?"
- "I want to see exactly what my content looks like as I write it"
- "These clunky IDE interfaces slow my work down"

Wendy Thinks:
- "Why am I using an IDE for simple text editing?"
- "Can I streamline my workflow or make it faster using a keyboard?"
- "Will any alternatives help me write content faster?"

Wendy Feels:
- Irritation that she needs to use bloated software for a simple text editing task.
- Motivation to find an alternate tool.

Wendy Does:
- Wites and edits technical content in Markdown.
- Spends excessive time using non-intuitive and bloated interfaces.

##### Educator Eric

Educator Eric is an experienced University Educator aged 42.

###### Goals:
1. To be able to produce all of his educational materials in Markdown.
2. To be able to educate students on Markdown in a way that is lightweight and easy to understand.
3. To be able to produce study materials with syntax highlighted code.

###### Frustrations:
1. Tools are never tailored to and educational environment.
2. There are very few word processors that can provide syntax highlighted code.
3. Students do not understand how powerful Markdown is.

###### Empathy Map:

Eric Says:
- "Using Markdown makes text writing easier and more professional"
- "Why is it so hard to find a word processor that supports syntax highlighting?"
- "I really need tailored tools for teaching Markdown"

Eric Thinks:
- "How can I make Markdown more accessible to my students?"
- "How can I make visually engaging education materials with Markdown?"

Eric Feels:
- Annoyed that large tools overlook educational use cases.
- Pride when students understand Markdown.

#### High-Level User Stories

Based on the personas and empathy maps, I have created 5 high-level user stories:
1. As a user, I want to view live previews of my Markdown content so that I can immediately see how it will render any rectify any issues.
2. As a user, I want the option to customise the view of the editor, such as, switching between light and dark mode so that the website is accessible.
3. As a user, I want the editor to be lightweight and intuitive, so that I can focus on editing Markdown rather than learning the tool I am using.
4. As a user, I want to create and edit Markdown with syntax highlighting, so that code in the Markdown can be read easily.
5. As a user, I want the tool to be accessible via the web, so that I can avoid downloading more software to my machine.

### MoSCoW Prioritisation

In order to prioritise the stories that will be completed, I have created a MoSCoW prioritisation, this will allow me to decide which stories are the most important to be developed, and which can be left to later stages or made optional.

| Must Have | Should Have | Could Have | Wont Have |
| - | - | - | - |
| Live Markdown Preview | Dark and Light Mode | Export Options | Collaboration Features |
| Lightweight Design | Syntax Highlighting | Offline Mode
| Web Accessibility | | Templates |
| Accessible Design | | Responsible Web Design

Notably, I have added wont have "Collaboration Features"; this is something that I feel would enhance the educational aspect of the tool, to suit Educator Eric, and is something that I would like to add in the future, but I do not feel it fits into the scope of this MVP.

### Project Management

All of the project management strategy will be carried out using tools available in GitHub, this is ideal as it ensures that the Source Code Management and Project Management are in the same place. Below are details of different items we will use to manage this project, how they will be used, and why we are using them.

#### Issues, Epics and Stories

The primary tool to allocate and decide work, both for bugs, features, infrastructure changes, and anything else, will be through GitHub issues. These are available on the repositories [issue page](https://github.com/Dinoosawruss/software-engineering-summative-1/issues) and provide an outlet to write a description for any piece of work that will be carried out.

There will be five types of issue used within the project:
1. Feature Story - A piece of work that is a feature to be added, this should be in the form of a user story (i.e. As a user, I want to do x, so that I can y).
2. Epic - These will be a collection of work in the form of Feature Story or Infrastructure (below) issues. The Epic should have a description that covers all of the work within it.
3. Bug - Any bugs within the project should be reported through bug issues, these will be handled outside the normal project management scheme and will not be part of a Sprint, Epic, etc.
4. Infrastructure - These are changes that involve changes to any development or project management infrastructure used by the project.
5. Other - Any issue required that does not easily fit into one of these categories.

Infrastructure and Feature issues will always be assigned to an Epic unless they are clearly a discrete and standalone piece of work. This will ensure that the project is driven in a way where features are always associated with some larger piece of work.

#### Sizing

As part of the Feature and Infrastructure issue creation process, they should be sized. In this project we will use shirt sizing in order to allocate the size of each issue, i.e. Small, Medium, Large, Extra Large. The size allocated should be based on the amount of work that the change is expected to require, rather than some measure of time; one should not consider how long it will take them to implement the feature, they should consider how much work it will be. The sizing of issues will ensure that the amount of work within each sprint can be balanced and that issues remain an appropriate size. Any issues sized as Extra Large are to big, it is required that they are broken up into smaller issues.

Only Infrastructure, Feature and *some* Other issues should be sized. Any issue that is sized should, ideally, be associated with an Epic as it should form a larger piece of work.

#### Prioritisation

#### Sprints

#### Labels

In order to facilitate the issue types

#### GitHub Projects

### Risks

## Documentation

### User

### Technical

## Evaluation