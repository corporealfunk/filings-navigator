class Filing < ApplicationRecord
  has_many :awards
  belongs_to :filer, class_name: 'Organization'

  # TODO: maybe we need an index here if we had a lot of data
  scope :sorted, -> { order(return_timestamp: :desc) }

  scope :canonical, -> { where(is_canonical: true) }

  # updates all filings and marks which is canonical for
  # a given tax year
  def self.audit_canonical_flag!
    Filing.
      select('filer_id,tax_period_end_date').
      distinct.
      pluck(
        :filer_id,
        :tax_period_end_date
      ).each do |filer_id, tax_period_end_date|
        # for this filer and taxperiod, we need find all the filings
        filings = Filing.where(
          filer_id: filer_id,
          tax_period_end_date: tax_period_end_date
        ).order(return_timestamp: :desc)

        # TODO: we are just taking the most recent one. Is that OK?
        # I'm not relying is_ammended flag, because in our dataset it
        # seems like the cananicaol return is the last one filed that year
        # TODO: this is really not very efficient, I mean, most of these
        # filers only have 1 return for a year, why marke them all false then update again?
        # we could have a lot more logic here to speed it up
        # TODO: maybe we could just have some big fancy update SQL statement
        # with subqueries and groupings...
        # or at least just look at filers with more than one... so maybe run
        # a group statement first where the count > 1 and only operate on
        # those
        if filings.count > 0
          # update subset to false:
          filings.update_all(is_canonical: false)
          filings.first.update_attribute :is_canonical, true
        end
      end
  end
end
