let video;
//let keys = JSON.parse(cpose);
let poseNet;
let pose;
let skeleton;

let brain;

let poseLabel;
let instr = '';

var msg = new SpeechSynthesisUtterance();

function setup() {
  var cnvs = createCanvas(640, 480);
  cnvs.style('margin-top', '150px');
  cnvs.style('margin-left', '330px');
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, posenetLoaded);
  poseNet.on('pose', gotPoses);
  
  let options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
      model: 'model - 150.json',
      metadata: 'model_meta - 150.json',
      weights: 'model.weights - 150.bin'
  };
  brain.load(modelInfo, modelLoaded);
}

function posenetLoaded() {
    console.log('poseNet ready');
}

function modelLoaded() {
    console.log('model ready!');
    classifyPose();
}

function classifyPose() {
    if (pose) 
    {
        let inputs = [];
        for(let i = 0; i < pose.keypoints.length; i++)
        {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResult);
        correct();
    }
    else
    {
        setTimeout(classifyPose, 100);
    }
}

function gotResult(error, results) {
    console.log(results);
    console.log(results[0].label);
    if(results[0].label == 'm')
    {
        poseLabel = 'Mountain pose';
        instr = '';
    }
    else
    {
        poseLabel = 'Chair pose';
        instr = '';
    }
    console.log('running the model again...')
    setTimeout(classifyPose, 7000);
}

function correct() {
    if (pose)
    {
        eyeRX = pose.rightEye.x;
        eyeRY = pose.rightEye.y;
        shoulderRX = pose.rightShoulder.x;
        shoulderRY = pose.rightShoulder.y;
        shoulderLX = pose.leftShoulder.x;
        shoulderLY = pose.leftShoulder.y;
        elbowRX = pose.rightElbow.x;
        elbowRY = pose.rightElbow.y;
        elbowLX = pose.leftElbow.x;
        elbowLY = pose.leftElbow.y;
        wristRX = pose.rightWrist.x;
        wristRY = pose.rightWrist.y;
        wristLX = pose.leftWrist.x;
        wristLY = pose.leftWrist.y;
        hipRX = pose.rightHip.x;
        hipRY = pose.rightHip.y;
        hipLX = pose.leftHip.x;
        hipLY = pose.leftHip.y;
        kneeRX = pose.rightKnee.x;
        kneeRY = pose.rightKnee.y;
        kneeLX = pose.leftKnee.x;
        kneeLY = pose.leftKnee.y;
        ankleRX = pose.rightAnkle.x;
        ankleRY = pose.rightAnkle.y;
        ankleLX = pose.leftAnkle.x;
        ankleLY = pose.leftAnkle.y;
        
        var correct = true;
                
                
        
                if(eyeRY<=50 && ankleLY>=450 && ankleLY<=480  )
                {
                    instr = 'good to go';
                    msg.text = "position fixed you can continue";
                    window.speechSynthesis.speak(msg);
                    msg.text = "redirecting to chair pose please wait for a second";
                    window.speechSynthesis.speak(msg);
                    
                    correct = false;
                           setTimeout(function(){
                    window.location.href = 'ccorrect.html';
                 }, 5000);
                    
                }
                else
                {
                    instr= 'not in position';
                    msg.text = 'please fix your position';
                    window.speechSynthesis.speak(msg);
                }
                
                
              }  
               
       
            
            
         
    
    
        
            
    else
    {
        setTimeout(correct(), 5000);
    }
    
  }  


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw()
{
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);
    
    if(pose)
    {
        for(let i = 0; i < pose.keypoints.length; i++)
        {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0, 255, 0);
            ellipse(x, y, 16, 16);
        }
        
        for(let i = 0; i < skeleton.length; i++)
        {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    }
    
    
    strokeWeight(2);
    stroke(170);
    line(0, 10, 640, 10);
    line(0, 20, 640, 20);
    line(0, 50, 640, 50);
    line(0, 100, 640, 100);
    line(0, 150, 640, 150);
    line(0, 200, 640, 200);
    line(0, 250, 640, 250);
    line(0, 300, 640, 300);
    line(0, 350, 640, 350);
    line(0, 400, 640, 400);
    line(0, 450, 640, 450);
    
    
    pop();

    fill(0, 0, 0);  
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT);
    //text(poseLabel, 50, 30);
    text(instr, 20, 30);
    
    
}
