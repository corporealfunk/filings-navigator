module Paginator
  def self.setup_relation_and_pagination_data(active_record_relation:, page:, limit:)
    total_records = active_record_relation.count

    # no records, that's kind of a special case:
    if total_records == 0
      return {
        data: active_record_relation,
        pagination: {
          total_records: 0,
          current_page: nil,
          total_pages: 0,
          next_page: nil,
          prev_page: nil,
          limit: limit
        }
      }
    end

    # we have records, calculate:
    limit = total_records if limit == 0

    total_pages = (total_records / limit.to_f).ceil

    {
      data: active_record_relation
        .offset((page - 1) * limit)
        .limit(limit),
      pagination: {
        total_records: total_records,
        current_page: page,
        total_pages: total_pages,
        next_page: page < total_pages ? page + 1 : nil,
        prev_page: page > 1 ? page - 1 : nil,
        limit: limit
      }
    }
  end
end
