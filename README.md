



Hi, My name is Maria
My App is callled *Justice Hub*
Short description
"Justice Hub" is an AI-powered legal information app that helps people understand their rights in simple language.
README
In Justice Hub, Users can describe their situation and location, and Justice Hub provides relevant legal information, practical next steps, reliable sources, and key contacts, including police stations, hospitals, and other support services. Its goal is to make the law easier to understand and use — because law should be a tool, not a wall.

Technologies Used

React Native — used to build the mobile app.

Expo — used to develop, test, and run the React Native app across devices. Expo supports Android, iOS, and web development. (Expo documentation)

Expo Snack — used for quickly testing and experimenting with the prototype in the browser. (Expo documentation)

Codex — used as an AI coding assistant to help generate, modify, debug, and improve the app code.

Government legal websites — used as sources for legal information, including Thailand and China government sources.

GitHub — used to store and share the project's source code and documentation. A GitHub repository contains the project's code, files, and revision history. (GitHub Docs)

Open-source license — included so the project can be publicly shared according to the competition requirements.

Main Features

Describe a problem — users explain what happened in their own words.

Choose a location — the app identifies the relevant country/jurisdiction.

Understand the law — explains legal information in simpler language.

Relevant laws and sources — connects information to government/legal sources.

Next steps — gives practical information about what the user can consider doing next.

Important contacts — provides relevant phone numbers such as police, hospitals, and support services.

Evidence guidance — explains general ways to preserve relevant information or evidence.

Safety disclaimer — clearly explains that Justice Hub is legal information, not a replacement for a lawyer.

3. Keyboard Shortcuts
If you mean the keyboard shortcuts I use while developing, these are useful:


Shortcut | Use
-- | --
⌘ + C | Copy
⌘ + V | Paste
⌘ + S | Save
⌘ + Z | Undo
⌘ + Shift + Z | Redo
⌘ + F | Find text
⌘ + P | Open command/palette or print depending on app
⌘ + Shift + P | Command Palette in VS Code
Ctrl + C | Stop a running terminal process
4. Development Process
Idea → Research → Design → Prototype → Coding → Testing → Improvement

Step 1 — Identify the problem
I wanted to solve a simple problem:

“If you don't know your rights, how can you protect them?”

I noticed that when people face serious questions and want legal terms to help, it can be difficult to understand because of complicated language and because people may not know where to start.

Step 2 — Research
I researched legal information and official sources, including government websites from Thailand and China.

The important principle was to use reliable sources rather than allowing an AI to make up legal information.

Step 3 — Design
I designed the Justice Hub interface around a simple flow:

Problem → Location → Legal information → Next steps → Important contacts

Step 4 — Prototype
I first created the interface and prototype, then used Expo Snack to experiment with the mobile version.

Snack is specifically designed for quickly experimenting with React Native without setting up the whole development environment. (Expo documentation)

Step 5 — Build with Codex
I used Codex as a coding assistant to help turn my designs and ideas into React Native/Expo code.

I gave it instructions such as:

create the screen

change the layout

add buttons

fix errors

improve navigation

add my Justice Hub logo

make the interface responsive

Step 6 — Test
I tested the prototype on a device and checked:

buttons

navigation

text

screen layout

user flow

errors

Expo's development server can be started with npx expo start, which provides a QR code that can be opened on a device. (Expo documentation)

Step 7 — Document and share
The source code can then be placed in a public GitHub repository, together with a README explaining the project and how to run it. GitHub recommends README files for explaining what a project does and how people can get started. (GitHub Docs)

5. How I Built It
A simple explanation for judges:

I designed the Justice Hub interface first, researched reliable government legal sources, and then used React Native and Expo to develop the mobile prototype. I used Codex as an AI coding assistant to help write and debug the code. I tested the prototype using Expo Snack and Expo Go, then organized the source code and documentation in GitHub.

That's actually a good story for you, because it shows you didn't just say “AI made my app.” You can explain what you designed, what you researched, what tools you used, and what you learned.

6. What I Learned
You could put:

How a real app is structured and developed.

The basics of React Native and Expo.

How to use an AI coding assistant effectively.

How to debug errors instead of simply starting over.

How important reliable sources are when building a legal-information product.

How location/jurisdiction changes the information an app should provide.

How to design a simple user flow around a real-world problem.

How to test an app on an actual device.

How to organize a project using GitHub.

One particularly strong point for your project:

I learned that using AI is not just about generating code. I still need to understand the problem, check the information, test the result, and decide whether the output is actually useful.

7. How I Can Improve Justice Hub
For the next version, I would improve:

1. Real AI backend
Instead of using a prototype response, connect the app to an actual AI backend.

2. Retrieval from verified legal sources
Use a retrieval system so the AI searches approved legal sources before generating an explanation.

3. More countries
Start with Thailand and China, then expand to more jurisdictions.

4. Better local contacts
Create a verified database of important contacts, such as police, hospitals, emergency services, and support organizations.

5. Better safety handling
For serious situations, the app should prioritize immediate safety and appropriate professional help rather than treating everything as a normal legal question.

6. Multilingual support
Allow users to ask questions in languages such as English, Chinese, and Thai.

7. Better verification
Show exactly where legal information came from and when it was last checked.

8. User-specific answers
Make the response change based on the user's specific situation + location, rather than behaving like a normal general-purpose chatbot.

8. How to Run the Project
For someone who downloads your GitHub project:

Requirements
Node.js

Expo

A phone with Expo Go, or an emulator/simulator

The Justice Hub source code

Expo's current documentation recommends Node.js LTS and supports macOS, Windows, and Linux development environments. (Expo documentation)

Commands
# 1. Download the project
git clone YOUR_GITHUB_REPOSITORY
2. Enter the project

cd Justice-Hub


3. Install dependencies

npm install


4. Start Expo

npx expo start

Then scan the QR code with your phone to open the project in Expo Go. (Expo documentation)

For a more advanced development build, Expo also supports development builds and native Android/iOS builds. (Expo documentation)

One thing I'd change for your global submission
Don't say “I built the entire app using Codex.”

Say:

“I used Codex as an AI coding assistant to help develop, debug, and iterate on the React Native/Expo application.”

That sounds more accurate and shows you were the person designing the product and making the decisions, while AI was one of your development tools.

Yes. Since this is for your Justice Hub project documentation / GitHub README, I’d organize it like this so judges can quickly understand what you built.
1. Technologies Used
React Native — used to build the mobile app.
Expo — used to develop, test, and run the React Native app across devices. Expo supports Android, iOS, and web development. ([Expo documentation][1])
Expo Snack — used for quickly testing and experimenting with the prototype in the browser. ([Expo documentation][2])
Codex — used as an AI coding assistant to help generate, modify, debug, and improve the app code.
Government legal websites — used as sources for legal information, including Thailand and China government sources.
GitHub — used to store and share the project's source code and documentation. A GitHub repository contains the project's code, files, and revision history. ([GitHub Docs][3])
Open-source license — included so the project can be publicly shared according to the competition requirements.
2. Main Features
Describe a problem — users explain what happened in their own words.
Choose a location — the app identifies the relevant country/jurisdiction.
Understand the law — explains legal information in simpler language.
Relevant laws and sources — connects information to government/legal sources.
Next steps — gives practical information about what the user can consider doing next.
Important contacts — provides relevant phone numbers such as police, hospitals, and support services.
Evidence guidance — explains general ways to preserve relevant information or evidence.
Safety disclaimer — clearly explains that Justice Hub is legal information, not a replacement for a lawyer.
3. Keyboard Shortcuts
If you mean the keyboard shortcuts I use while developing, these are useful:

Shortcut	Use
⌘ + C	Copy
⌘ + V	Paste
⌘ + S	Save
⌘ + Z	Undo
⌘ + Shift + Z	Redo
⌘ + F	Find text
⌘ + P	Open command/palette or print depending on app
⌘ + Shift + P	Command Palette in VS Code
Ctrl + C	Stop a running terminal process
For your README, though, you probably don't need this section unless the competition specifically asks for it.

4. Development Process
Idea → Research → Design → Prototype → Coding → Testing → Improvement

Step 1 — Identify the problem
I wanted to solve a simple problem:

“If you don't know your rights, how can you protect them?”

I noticed that legal information can be difficult to understand because of complicated language and because people may not know where to start.

Step 2 — Research
I researched legal information and official sources, including government websites from Thailand and China.

The important principle was to use reliable sources rather than allowing an AI to simply make up legal information.

Step 3 — Design
I designed the Justice Hub interface around a simple flow:

Problem → Location → Legal information → Next steps → Important contacts

Step 4 — Prototype
I first created the interface and prototype, then used Expo Snack to experiment with the mobile version.

Snack is specifically designed for quickly experimenting with React Native without setting up the whole development environment. ([Expo documentation][2])

Step 5 — Build with Codex
I used Codex as a coding assistant to help turn my designs and ideas into React Native/Expo code.

I gave it instructions such as:

create the screen
change the layout
add buttons
fix errors
improve navigation
add my Justice Hub logo
make the interface responsive
Step 6 — Test
I tested the prototype on a device and checked:

buttons
navigation
text
screen layout
user flow
errors
Expo's development server can be started with npx expo start, which provides a QR code that can be opened on a device. ([Expo documentation][4])

Step 7 — Document and share
The source code can then be placed in a public GitHub repository, together with a README explaining the project and how to run it. GitHub recommends README files for explaining what a project does and how people can get started. ([GitHub Docs][5])

5. How I Built It🙃
I designed the Justice Hub interface first, researched reliable government legal sources, and then used React Native and Expo to develop the mobile prototype. I used Codex as an AI coding assistant to help write and debug the code. I tested the prototype using Expo Snack and Expo Go, then organized the source code and documentation in GitHub.

6. What I Learned
How a real app is structured and developed.
The basics of React Native and Expo.
How to use an AI coding assistant effectively.
How to debug errors instead of simply starting over.
How important reliable sources are when building a legal-information product.
How location/jurisdiction changes the information an app should provide.
How to design a simple user flow around a real-world problem.
How to test an app on an actual device.
How to organize a project using GitHub.
7. How I Can Improve Justice Hub
For the next version, I would improve:

1. Real AI backend
Instead of using a prototype response, connect the app to an actual AI backend.

2. Retrieval from verified legal sources
Use a retrieval system so the AI searches approved legal sources before generating an explanation.

3. More countries
Start with Thailand and China, then expand to more jurisdictions.

4. Better local contacts
Create a verified database of important contacts, such as police, hospitals, emergency services, and support organizations.

5. Better safety handling
For serious situations, the app should prioritize immediate safety and appropriate professional help rather than treating everything as a normal legal question.

6. Multilingual support
Allow users to ask questions in languages such as English, Chinese, and Thai.

7. Better verification
Show exactly where legal information came from and when it was last checked.

8. User-specific answers
Make the response change based on the user's specific situation + location, rather than behaving like a normal general-purpose chatbot.

8. How to Run the Project
Requirements
Node.js
Expo
A phone with Expo Go, or an emulator/simulator
The Justice Hub source code, website
Commands
# 1. Download the project
https://snack-runtime.eascdn.net/v2/54/index.html?initialUrl=exp%3A%2F%2Fu.expo.dev%2F933fd9c0-1666-11e7-afca-d980795c5824%3Fruntime-version%3Dexposdk%253A54.0.0%26channel-name%3Dproduction%26snack%3D%2540mariaaaaaaaaaaa%252Fjustice-hub%26snack-channel%3DpjRZ93smO0&origin=https%3A%2F%2Fsnack.expo.dev&verbose=false

# 2. Enter the project
cd Justice-Hub

# 3. Install dependencies
npm install

# 4. Start Expo
npx expo start
Then scan the QR code with your phone to open the project in Expo Go. ([Expo documentation][4])

For a more advanced development build, Expo also supports development builds and native Android/iOS builds. ([Expo documentation][7])
