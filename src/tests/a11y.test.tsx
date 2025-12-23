import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import 'jest-axe/extend-expect'
import Home from '@/app/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

expect.extend(toHaveNoViolations)

describe('Accessibility Checks', () => {
    it('Landing Page should have no violations', async () => {
        const { container } = render(<Home />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('Button component should have no violations', async () => {
        const { container } = render(<Button>Click me</Button>)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('Input component should have no violations', async () => {
        const { container } = render(
            <>
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" />
            </>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('Checkbox component should have no violations', async () => {
        const { container } = render(<Checkbox label="Accept terms" id="terms" />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
})
