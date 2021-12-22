/* global beforeEach, test, jest, expect */
import { render, fireEvent } from '@testing-library/svelte'
import App from './App.svelte'

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

test('does a basic calculation', async () => {
  const { getByText, getAllByLabelText } = render(App)
  await fireEvent.click(getByText('Add fabric piece'))
  expect(getByText('18 inches')).toBeInTheDocument()
  expect(getByText('Fabric piece #1: 10 wide by 10 long, at position 0, 0')).toBeInTheDocument()
  const width = getAllByLabelText('Width:')[1]
  await fireEvent.input(width, { target: { value: '20' } })
  expect(getByText('18 inches')).toBeInTheDocument()
  expect(getByText('Fabric piece #1: 20 wide by 10 long, at position 0, 0')).toBeInTheDocument()
})

test('shows an error when too big', async () => {
  const { getByText, getAllByLabelText } = render(App)
  await fireEvent.click(getByText('Add fabric piece'))
  const width = getAllByLabelText('Width:')[1]
  const height = getAllByLabelText('Length:')[1]
  await fireEvent.input(width, { target: { value: '9999999' } })
  expect(getByText('Could not calculate a solution to this problem.')).toBeInTheDocument()
  await fireEvent.input(height, { target: { value: '9999999' } })
  expect(getByText(
    'One of the pieces of fabric is larger than the size of the fabric you are buying.'
  )).toBeInTheDocument()
})

test('can disable rotation', async () => {
  const { getByText, getAllByLabelText, getByLabelText } = render(App)
  await fireEvent.click(getByText('Add fabric piece'))
  const height = getAllByLabelText('Length:')[1]
  await fireEvent.input(height, { target: { value: '40' } })
  expect(getByText('18 inches')).toBeInTheDocument()
  expect(getByText('Fabric piece #1: 40 wide by 10 long, at position 0, 0')).toBeInTheDocument()
  await fireEvent.click(getByLabelText('Allow rotation of fabric pieces'))
  expect(getByText('54 inches')).toBeInTheDocument()
  expect(getByText('Fabric piece #1: 10 wide by 40 long, at position 0, 0')).toBeInTheDocument()
})

test('can add multiple pieces at once and remove them all at once', async () => {
  const { getByText, getByLabelText, getAllByRole, queryAllByRole } = render(App)
  await fireEvent.input(getByLabelText('Width:'), { target: { value: '17' } })
  await fireEvent.input(getByLabelText('Length:'), { target: { value: '42' } })
  await fireEvent.input(getByLabelText('Number of pieces to add:'), { target: { value: 5 } })
  await fireEvent.click(getByText('Add fabric pieces'))
  expect(getByText('Fabric piece #5: 42 wide by 17 long, at position 0, 68')).toBeInTheDocument()
  expect(getAllByRole('listitem').length).toEqual(10) // 5 in the editor picker, 5 in the accessible display
  await fireEvent.click(getByText('Remove all'))
  expect(queryAllByRole('listitem').length).toEqual(0)
})
