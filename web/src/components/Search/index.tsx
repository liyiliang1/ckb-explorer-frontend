import React, { useContext } from 'react'
import styled from 'styled-components'
import AppContext from '../../contexts/App'
import { fetchSearchResult } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { TransactionWrapper } from '../../http/response/Transaction'
import { AddressWrapper } from '../../http/response/Address'
import browserHistory from '../../routes/history'
import SearchLogo from '../../asserts/search.png'

const SearchPanel = styled.div`
  max-width: 650px;
  width: 100%;
  margin: 0 auto;
  height: 65px;
  text-align: center;
  position: relative;
  > input {
    position: relative;
    width: 100%;
    color: rgba(186, 186, 186, 100);
    height: 65px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 106px;
    padding-right: 61px;
    border-radius: 6px;
    &: focus {
      color: black;
      opacity: 1 !important;
      outline: none;
    }
  }

  > div {
    display: inline-block;
    position: absolute;
    top: 14px;
    right: 9px;
    width: 41px;
    height: 41px;
    opacity: 0.8;
    &: hover {
      opacity: 1;
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
`

const Search = ({ opacity = false }: { opacity?: boolean }) => {
  const appContext = useContext(AppContext)

  const handleSearchResult = (q: string) => {
    if (!q) {
      appContext.toastMessage('Please input valid content', 3000)
    } else {
      appContext.showLoading()
      fetchSearchResult(q)
        .then((json: any) => {
          appContext.hideLoading()
          const { data } = json
          if (data.type === 'block') {
            browserHistory.push(`/block/${(data as BlockWrapper).attributes.block_hash}`)
          } else if (data.type === 'ckb_transaction') {
            // interface here should change by backyard ckb_transaction to transaction
            browserHistory.push(`/transaction/${(data as TransactionWrapper).attributes.transaction_hash}`)
          } else if (data.type === 'address') {
            browserHistory.push(`/address/${(data as AddressWrapper).attributes.address_hash}`)
          } else {
            browserHistory.push('/search/fail')
          }
        })
        .catch(() => {
          appContext.hideLoading()
          browserHistory.push(`/search/fail?q=${q}`)
        })
    }
  }

  const opacityStyle = {
    opacity: 1,
    border: '2px solid rgb(24, 50, 93)',
  }

  const transparentStyle = {
    opacity: 0.2,
  }

  return (
    <SearchPanel>
      <input
        id="home__search__bar"
        placeholder="Block Height / Block Hash / Tx Hash / Address"
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult(event.target.value)
          }
        }}
        style={opacity ? opacityStyle : transparentStyle}
      />
      <div
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          const homeSearchBar = document.getElementById('home__search__bar') as HTMLInputElement
          handleSearchResult(homeSearchBar.value)
        }}
      >
        <img src={SearchLogo} alt="search logo" />
      </div>
    </SearchPanel>
  )
}

export default Search
