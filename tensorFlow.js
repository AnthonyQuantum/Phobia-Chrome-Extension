function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.0");

const model = tf.sequential();
      model.add(tf.layers.dense({units: 1, inputShape: [1]}));

      // Prepare the model for training: Specify the loss and the optimizer.
      model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

      // Generate some synthetic data for training.
      const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
      const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

      // Train the model using the data.
      model.fit(xs, ys).then(() => {
        // Use the model to do inference on a data point the model hasn't seen before:
        // Open the browser devtools to see the output
        model.predict(tf.tensor2d([5], [1, 1])).print();
      });