import React from "react";
import "./index.css";
import Category from "./Category";
import Player from "./Player";
import axios from "axios";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.showQuestionDisplay = false;
        this.showQuestionGrid = true;
        this.state = { 
            board: []
        };

        this.serverAddress = "http://127.0.0.1:8000/";
        this.server = axios.create({
            baseURL: this.serverAddress,
            timeout: 1000
        })

        this.colours = [
            "#5bc0ebff",
            "#c3423fff",
            "#eae151ff",
            "#404e4dff",
            "#558564ff",
            "#ff88dcff",
            "#6622ccff"
        ]
    }

    componentDidMount() {
        this.fetchData();

    }

    fetchData = () => {
        this.server.get('board-data')
        .then(res => {
            console.log(res);
            this.setState({
                board: res.data
            });
            this.refreshCategories();
        });
    }

    fetchState = () => {

    }

    refreshCategories() {
        this.categoriesObj = [];
        this.state.board.forEach((cat, i) => {
            this.categoriesObj.push(<Category key={i} name={cat.title} questions={cat.questions} backgroundColour={this.colours[i]} ></Category>);
        });
        
    }

    render() {
        return (
            <div className="App">
                <div
                    className="FlexContainer QuestionDisplay"
                    style={{ display: this.showQuestionDisplay ? "flex" : "none" }}
                >

                    <div className="QuestionContent">
                        <p className="QuestionContentTitle">What is this?</p>
                        <video className="video" controls>
                            <source src="epicbreach.mp4" type="video/mp4"></source>
                        </video>

                  
                        <p className="QuestionContentAnswer">Answer: Border Collie</p>
                    </div>
                </div>
                <div
                    className="FlexContainer QuestionGrid"
                    style={{ display: this.showQuestionGrid ? "flex" : "none" }}
                >

                    {this.categoriesObj}

                    {/* <Category
                        name="Cat1"
                        questionCount="4"
                        backgroundColour="var(--aero)"
                    ></Category>
                    <Category
                        name="Test"
                        questionCount="3"
                        backgroundColour="var(--persian-red)"
                    ></Category>
                    <Category
                        name="Animals"
                        questionCount="5"
                        backgroundColour="var(--maize)"
                    ></Category>
                    <Category
                        name="Famous quotes"
                        questionCount="7"
                        backgroundColour="var(--persian-pink)"
                    ></Category>
                    <Category
                        name="The big boyz"
                        questionCount="3"
                        backgroundColour="var(--french-violet)"
                    ></Category> */}
                    {/* <Category name="The big boyz"   questions={[{ type: "Video",  question: "What is this?", pointValue: 100, source: "epicbreach.mp4" }, { type: "Text", pointValue: 1000, question: "I don't know" }]} backgroundColour="var(--french-violet)"></Category> */}
                </div>
                <div className="PlayerFooter">
                    <Player name="Adam" score="100"></Player>
                    <Player name="Callum" score="100"></Player>
                    <Player name="Emily" score="100"></Player>
                    <Player name="Koni" score="100"></Player>
                    <Player name="Hayley" score="100"></Player>
                    <Player name="Lauren" score="100"></Player>
                    <Player name="James" score="100"></Player>
                    <Player name="Beth" score="100"></Player>
                </div>
            </div>
        );
    }
}

export default App;
