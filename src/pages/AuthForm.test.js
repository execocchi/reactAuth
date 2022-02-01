/* eslint-disable jest/valid-title */
import { render, screen } from '@testing-library/react';
import AuthForm from './AuthForm';

describe("AuthForm component",()=>{
    test("renders no error at input fields if the button IS NOT clicked",()=>{
        render(<AuthForm/>)

        const outputElement=screen.queryByText("Enter a valid email",{exact:false})
        expect(outputElement).toBeNull()

    })
    test("renders <option>roles</option> in form if requests to api succeeds",async()=>{
        window.fetch=jest.fn()
        window.fetch.mockResolvedValueOnce({
            data:async()=>[{name:"Administrador"}]
        });
        render(<AuthForm/>)       

    })
})