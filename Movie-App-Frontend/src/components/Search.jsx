import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="relative w-full max-w-3xl group">
      <div className="absolute -inset-px rounded-full bg-gradient-to-r from-brand/0 via-brand/40 to-ember/0 opacity-0 blur-md transition-opacity duration-500 group-focus-within:opacity-100" />
      <div className="relative flex items-center">
        <svg className="absolute left-5 sm:left-6 h-5 w-5 sm:h-6 sm:w-6 text-light-200 group-focus-within:text-brand transition-colors pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>

        <input
          type='text'
          placeholder='Search titles, shows, movies…'
          aria-label='Search for shows and movies'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-full bg-black/50 backdrop-blur-xl border border-white/15 py-4 sm:py-5 pl-14 sm:pl-16 pr-14 text-base sm:text-lg text-white placeholder-gray-100 outline-none transition-colors focus:border-brand/60 focus:bg-black/70"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
            className="absolute right-3 sm:right-4 w-9 h-9 flex items-center justify-center rounded-full text-light-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Search
