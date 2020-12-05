var inputs = document.querySelectorAll("select, input:not([type='checkbox'])");

function addClassFormControl(inputs) {
    inputs.forEach(input => {
        if(!input.classList.contains('form-control')){
            input.classList.add('form-control', 'form-control-sm');
            input.classList.add('form-control-sm');
        }
                                        
    });
}
        
addClassFormControl(inputs);