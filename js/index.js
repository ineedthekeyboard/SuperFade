$('.buttonbar').on('click', '.button', function (e) {
    if ($(e.target).hasClass('viewBtn1')) {
        transitionView('.v2', '.v1');
    }
    if ($(e.target).hasClass('viewBtn2')) {
        transitionView('.v1', '.v2',{position:true,promiseMode:true}).done(function(){
          console.log('promise finished');
        });
    }
});

//Options:
/**
initialView: the starting view to fade FROM
viewToTransitionto: the final view for the animation to end on
options:{
  speed:integer milliseconds the animation should take
  type: currently 'fade is the only option'
  position: bool which decided if the function should auto position views to be on top of each other
  initialPosition: the class who's offset both views will be set to.
}
**/
function transitionView(initialView, viewToTransitionTo, options) {

    //set defaults
    options = $.extend({},{
        speed: 300,
        type: 'fade',
        position: false,
        initialPosition:null,
        promiseMode:false
    },options);

    var $initialView = $(initialView),
        $viewToTransitionTo = $(viewToTransitionTo),
        d = $.Deferred();
    options.initialPosition ? options.initialPosition = $(options.initialPosition).offset() : options.initialPosition = null;

    function transition() {
        //Do Positioning if requested
        if (options.position) {
            positionViews();
        }
        //Actual transition
        $initialView.transition({opacity: 0, queue: false}, options.speed, 'snap');
        $viewToTransitionTo.transition({opacity: 1, queue: false, complete: function(){d.resolve();}}, options.speed, 'linear');
    }
    function positionViews() {
        var position = {};
        if (options.initialPosition) {
            position = options.initialPosition;
        } else {
            position = $initialView.offset();
        }
        var posX = position.left,
            posY = position.top;

        $initialView.css('position', 'absolute');
        $viewToTransitionTo.css('position', 'absolute');

        $initialView.css('top', posY);
        $initialView.css('left', posX);

        $viewToTransitionTo.css('top', posY);
        $viewToTransitionTo.css('left', posX);
    }

    transition();

    if (options.promiseMode){
      return d.promise();
    }
    //todo define a change of the promise to add the rejcetion policy on the evnt that the animation fails

    //todo define if or not a promise should be returned for async use.
    //todo define new types of fades
}
